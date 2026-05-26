const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../lib/db');
const { sendMessage } = require('../lib/claude');
const { generateNarrative } = require('../lib/narrativeGenerator');
const { generatePDF } = require('../lib/pdfGenerator');

const router = express.Router();
const PDF_DIR = path.join(__dirname, '../../.issatrix-pdfs');

function extractBrief(rawText) {
  const START = 'BRIEF_JSON_START';
  const END = 'BRIEF_JSON_END';
  const si = rawText.indexOf(START);
  const ei = rawText.indexOf(END);
  if (si === -1 || ei === -1) return { cleanText: rawText, brief: null };
  let jsonStr = rawText.slice(si + START.length, ei).trim();
  jsonStr = jsonStr.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  let brief = null;
  try {
    brief = JSON.parse(jsonStr);
  } catch (err) {
    console.error('Public: Failed to parse brief JSON:', err.message);
    return { cleanText: rawText, brief: null };
  }
  const before = rawText.slice(0, si).trim();
  const after = rawText.slice(ei + END.length).trim();
  return { cleanText: [before, after].filter(Boolean).join('\n\n'), brief };
}

// POST /api/public/sessions — create session + project (no auth)
router.post('/sessions', (req, res) => {
  const db = getDb();
  const { projectName } = req.body;
  const now = new Date().toISOString();
  const projectId = uuidv4();
  const sessionId = uuidv4();

  db.prepare(`
    INSERT INTO tokenization_projects (id, name, status, created_at, updated_at)
    VALUES (?, ?, 'draft', ?, ?)
  `).run(projectId, projectName || 'New Tokenization Project', now, now);

  db.prepare(`
    INSERT INTO agent_sessions (id, project_id, agent_type, messages, collected_data, status, created_at, updated_at)
    VALUES (?, ?, 'asset_structuring_agent', '[]', '{}', 'active', ?, ?)
  `).run(sessionId, projectId, now, now);

  res.json({ sessionId, projectId });
});

// POST /api/public/chat — send message and get agent response (no auth)
router.post('/chat', async (req, res) => {
  const db = getDb();
  const { sessionId, message } = req.body;
  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId and message are required' });
  }

  const session = db.prepare('SELECT * FROM agent_sessions WHERE id = ?').get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.status === 'completed') {
    return res.status(400).json({ error: 'Session is already completed' });
  }

  const messages = JSON.parse(session.messages);
  messages.push({ role: 'user', content: message });

  let agentText;
  try {
    agentText = await sendMessage(messages);
  } catch (err) {
    console.error('Public chat Claude error:', err.message);
    return res.status(500).json({ error: 'Failed to get agent response. Please try again.' });
  }

  messages.push({ role: 'assistant', content: agentText });

  const { cleanText, brief } = extractBrief(agentText);
  const displayMessage = cleanText || agentText;

  const now = new Date().toISOString();
  let briefId = null;

  if (brief) {
    briefId = uuidv4();
    db.prepare(`
      INSERT INTO tokenization_briefs (
        id, project_id, session_id,
        asset_overview, tokenization_model, investor_access_model,
        issuance_matrix_design, required_documents, technical_configuration,
        risks_and_open_questions, readiness_score, raw_json,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      briefId, session.project_id, sessionId,
      JSON.stringify(brief.assetOverview || {}),
      JSON.stringify(brief.tokenizationModel || {}),
      JSON.stringify(brief.investorAccessModel || {}),
      JSON.stringify(brief.issuanceMatrixDesign || {}),
      JSON.stringify(brief.requiredDocuments || []),
      JSON.stringify(brief.technicalConfiguration || {}),
      JSON.stringify(brief.risksAndOpenQuestions || []),
      brief.readinessScore || 'draft',
      JSON.stringify(brief),
      now, now,
    );

    db.prepare(`
      UPDATE tokenization_projects SET name = ?, asset_type = ?, status = ?, updated_at = ? WHERE id = ?
    `).run(
      brief.assetOverview?.assetName || undefined,
      brief.assetOverview?.assetType || undefined,
      brief.readinessScore || 'structuring',
      now,
      session.project_id,
    );

    db.prepare(`UPDATE agent_sessions SET status = 'completed', updated_at = ? WHERE id = ?`)
      .run(now, sessionId);
  }

  db.prepare('UPDATE agent_sessions SET messages = ?, updated_at = ? WHERE id = ?')
    .run(JSON.stringify(messages), now, sessionId);

  res.json({ message: displayMessage, briefGenerated: !!brief, briefId });
});

// POST /api/public/pdf/:briefId — trigger background PDF generation (no auth)
router.post('/pdf/:briefId', (req, res) => {
  res.json({ status: 'queued' });

  const { briefId } = req.params;
  const db = getDb();

  setImmediate(async () => {
    try {
      const row = db.prepare('SELECT * FROM tokenization_briefs WHERE id = ?').get(briefId);
      if (!row || row.pdf_path) return;

      const brief = {
        id: row.id,
        asset_overview:           JSON.parse(row.asset_overview           || '{}'),
        tokenization_model:       JSON.parse(row.tokenization_model       || '{}'),
        investor_access_model:    JSON.parse(row.investor_access_model    || '{}'),
        issuance_matrix_design:   JSON.parse(row.issuance_matrix_design   || '{}'),
        required_documents:       JSON.parse(row.required_documents       || '[]'),
        technical_configuration:  JSON.parse(row.technical_configuration  || '{}'),
        risks_and_open_questions: JSON.parse(row.risks_and_open_questions || '[]'),
        readiness_score:          row.readiness_score || 'draft',
        raw_json:                 JSON.parse(row.raw_json                 || '{}'),
      };

      if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true });

      const narrative = await generateNarrative(brief);
      const pdfBuffer = await generatePDF(brief, narrative);

      const filename = `structuring-book-${briefId}-${uuidv4().slice(0, 8)}.pdf`;
      const filePath = path.join(PDF_DIR, filename);
      fs.writeFileSync(filePath, pdfBuffer);

      const now = new Date().toISOString();
      db.prepare('UPDATE tokenization_briefs SET pdf_path = ?, pdf_generated_at = ?, updated_at = ? WHERE id = ?')
        .run(filePath, now, now, briefId);

      console.log(`  [public] PDF ready → ${filename}`);
    } catch (err) {
      console.error('[public] Background PDF generation failed:', err.message);
    }
  });
});

// GET /api/public/brief/:briefId — read-only public brief view
router.get('/brief/:briefId', (req, res) => {
  const { briefId } = req.params;
  const db = getDb();
  const row = db.prepare('SELECT * FROM tokenization_briefs WHERE id = ?').get(briefId);
  if (!row) return res.status(404).json({ error: 'Brief not found' });
  const project = db.prepare('SELECT name, status FROM tokenization_projects WHERE id = ?').get(row.project_id);
  res.json({
    id: row.id,
    project_name:             project?.name || null,
    asset_overview:           JSON.parse(row.asset_overview           || '{}'),
    tokenization_model:       JSON.parse(row.tokenization_model       || '{}'),
    investor_access_model:    JSON.parse(row.investor_access_model    || '{}'),
    issuance_matrix_design:   JSON.parse(row.issuance_matrix_design   || '{}'),
    required_documents:       JSON.parse(row.required_documents       || '[]'),
    technical_configuration:  JSON.parse(row.technical_configuration  || '{}'),
    risks_and_open_questions: JSON.parse(row.risks_and_open_questions || '[]'),
    readiness_score:          row.readiness_score || 'draft',
    created_at:               row.created_at,
  });
});

module.exports = router;
