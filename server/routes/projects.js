const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../lib/db');

const router = express.Router();
router.use(authMiddleware);

// GET /api/projects — list all projects
router.get('/', (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT p.*,
           b.id          AS brief_id,
           b.readiness_score,
           b.created_at  AS brief_created_at,
           s.id          AS session_id,
           s.status      AS session_status
    FROM tokenization_projects p
    LEFT JOIN tokenization_briefs b ON b.project_id = p.id
    LEFT JOIN agent_sessions s ON s.project_id = p.id
    ORDER BY p.created_at DESC
  `).all();
  res.json(rows);
});

// GET /api/projects/:id — get project with brief and session
router.get('/:id', (req, res) => {
  const db = getDb();
  const project = db.prepare('SELECT * FROM tokenization_projects WHERE id = ?').get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const briefRow = db.prepare(
    'SELECT * FROM tokenization_briefs WHERE project_id = ? ORDER BY created_at DESC LIMIT 1'
  ).get(req.params.id);

  const sessionRow = db.prepare(
    'SELECT id, status, created_at FROM agent_sessions WHERE project_id = ? ORDER BY created_at DESC LIMIT 1'
  ).get(req.params.id);

  const brief = briefRow
    ? {
        ...briefRow,
        asset_overview:           JSON.parse(briefRow.asset_overview),
        tokenization_model:       JSON.parse(briefRow.tokenization_model),
        investor_access_model:    JSON.parse(briefRow.investor_access_model),
        issuance_matrix_design:   JSON.parse(briefRow.issuance_matrix_design),
        required_documents:       JSON.parse(briefRow.required_documents),
        technical_configuration:  JSON.parse(briefRow.technical_configuration),
        risks_and_open_questions: JSON.parse(briefRow.risks_and_open_questions),
        raw_json:                 JSON.parse(briefRow.raw_json),
      }
    : null;

  res.json({ ...project, brief, session: sessionRow || null });
});

// PATCH /api/projects/:id/status — manually advance project status
router.patch('/:id/status', (req, res) => {
  const db = getDb();
  const VALID = ['draft', 'structuring', 'compliance_review', 'technical_review', 'ready_for_issuance'];
  const { status } = req.body;

  if (!VALID.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID.join(', ')}` });
  }

  const now = new Date().toISOString();
  db.prepare('UPDATE tokenization_projects SET status = ?, updated_at = ? WHERE id = ?')
    .run(status, now, req.params.id);

  res.json({ success: true, status });
});

module.exports = router;
