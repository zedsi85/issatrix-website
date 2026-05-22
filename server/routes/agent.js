const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const { sendMessage } = require('../lib/claude');
const { getDb } = require('../lib/db');

const router = express.Router();
router.use(authMiddleware);

function extractBrief(rawText) {
  const START = 'BRIEF_JSON_START';
  const END = 'BRIEF_JSON_END';
  const si = rawText.indexOf(START);
  const ei = rawText.indexOf(END);

  if (si === -1 || ei === -1) return { cleanText: rawText, brief: null };

  const jsonStr = rawText.slice(si + START.length, ei).trim();
  let brief = null;
  try {
    brief = JSON.parse(jsonStr);
  } catch (err) {
    console.error('Failed to parse brief JSON:', err.message);
    return { cleanText: rawText, brief: null };
  }

  const before = rawText.slice(0, si).trim();
  const after = rawText.slice(ei + END.length).trim();
  const cleanText = [before, after].filter(Boolean).join('\n\n');

  return { cleanText, brief };
}

// POST /api/agent/sessions — create session + project
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

// GET /api/agent/sessions — list all sessions
router.get('/sessions', (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT s.id, s.project_id, s.agent_type, s.status, s.created_at, s.updated_at,
           p.name AS project_name, p.status AS project_status
    FROM agent_sessions s
    JOIN tokenization_projects p ON s.project_id = p.id
    ORDER BY s.created_at DESC
  `).all();
  res.json(rows);
});

// GET /api/agent/sessions/:id — get single session with messages
router.get('/sessions/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare(`
    SELECT s.*, p.name AS project_name, p.status AS project_status
    FROM agent_sessions s
    JOIN tokenization_projects p ON s.project_id = p.id
    WHERE s.id = ?
  `).get(req.params.id);

  if (!row) return res.status(404).json({ error: 'Session not found' });

  res.json({
    ...row,
    messages: JSON.parse(row.messages),
    collected_data: JSON.parse(row.collected_data),
  });
});

// POST /api/agent/start — send initial greeting for a new session
router.post('/start', async (req, res) => {
  const db = getDb();
  const { sessionId } = req.body;

  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

  const session = db.prepare('SELECT * FROM agent_sessions WHERE id = ?').get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const existing = JSON.parse(session.messages);
  if (existing.length > 0) {
    const firstAgentMsg = existing.find((m) => m.role === 'assistant');
    return res.json({ message: firstAgentMsg?.content || '' });
  }

  const seed = [{ role: 'user', content: 'Hello. I would like to begin structuring a new tokenization project.' }];

  let agentText;
  try {
    agentText = await sendMessage(seed);
  } catch (err) {
    console.error('Claude API error:', err.message);
    return res.status(500).json({
      error: err.message.includes('ANTHROPIC_API_KEY')
        ? 'AI provider not configured — add ANTHROPIC_API_KEY to your .env file'
        : 'Failed to start agent session',
    });
  }

  const allMessages = [...seed, { role: 'assistant', content: agentText }];
  const now = new Date().toISOString();
  db.prepare('UPDATE agent_sessions SET messages = ?, updated_at = ? WHERE id = ?')
    .run(JSON.stringify(allMessages), now, sessionId);

  res.json({ message: agentText });
});

// POST /api/agent/chat — send a user message and get agent response
router.post('/chat', async (req, res) => {
  const db = getDb();
  const { sessionId, message } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId and message are required' });
  }

  const session = db.prepare('SELECT * FROM agent_sessions WHERE id = ?').get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.status === 'completed') {
    return res.status(400).json({ error: 'This session is already completed' });
  }

  const messages = JSON.parse(session.messages);
  messages.push({ role: 'user', content: message });

  let agentText;
  try {
    agentText = await sendMessage(messages);
  } catch (err) {
    console.error('Claude API error:', err.message);
    return res.status(500).json({
      error: err.message.includes('ANTHROPIC_API_KEY')
        ? 'AI provider not configured — add ANTHROPIC_API_KEY to your .env file'
        : 'Failed to get agent response',
    });
  }

  messages.push({ role: 'assistant', content: agentText });

  const { cleanText, brief } = extractBrief(agentText);
  const displayMessage = cleanText || (brief ? 'Tokenization Brief generated.' : agentText);

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

    const newName = brief.assetOverview?.assetName;
    db.prepare(`
      UPDATE tokenization_projects SET name = ?, asset_type = ?, status = ?, updated_at = ? WHERE id = ?
    `).run(
      newName || undefined,
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

  res.json({
    message: displayMessage,
    briefGenerated: !!brief,
    briefId,
  });
});

module.exports = router;
