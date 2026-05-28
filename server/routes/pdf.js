const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { authMiddleware } = require('../middleware/auth');
const { getDb } = require('../lib/db');
const { generateNarrative } = require('../lib/narrativeGenerator');
const { generatePDF } = require('../lib/pdfGenerator');

const router = express.Router();
router.use(authMiddleware);

const PDF_DIR = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, 'pdfs')
  : path.join(__dirname, '../../.issatrix-pdfs');

function ensurePdfDir() {
  if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true });
}

function getBriefRow(briefId) {
  return getDb().prepare('SELECT * FROM tokenization_briefs WHERE id = ?').get(briefId);
}

function parseBriefRow(row) {
  return {
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
}

async function doGenerate(briefId) {
  ensurePdfDir();
  const row = getBriefRow(briefId);
  if (!row) throw Object.assign(new Error('Brief not found'), { status: 404 });

  const brief = parseBriefRow(row);
  const narrative = await generateNarrative(brief);
  const pdfBuffer = await generatePDF(brief, narrative);

  const filename = `structuring-book-${briefId}-${uuidv4().slice(0, 8)}.pdf`;
  const filePath = path.join(PDF_DIR, filename);
  fs.writeFileSync(filePath, pdfBuffer);

  const now = new Date().toISOString();
  getDb()
    .prepare('UPDATE tokenization_briefs SET pdf_path = ?, pdf_generated_at = ?, updated_at = ? WHERE id = ?')
    .run(filePath, now, now, briefId);

  return { filename, filePath, generatedAt: now };
}

// POST /api/pdf/generate/:briefId
router.post('/generate/:briefId', async (req, res) => {
  try {
    const { briefId } = req.params;
    const row = getBriefRow(briefId);
    if (!row) return res.status(404).json({ error: 'Brief not found' });
    if (row.pdf_path && fs.existsSync(row.pdf_path)) {
      return res.json({
        status: 'exists',
        briefId,
        generatedAt: row.pdf_generated_at,
        downloadUrl: `/api/pdf/download/${briefId}`,
      });
    }
    const { generatedAt } = await doGenerate(briefId);
    res.json({ status: 'generated', briefId, generatedAt, downloadUrl: `/api/pdf/download/${briefId}` });
  } catch (err) {
    console.error('PDF generate error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// GET /api/pdf/download/:briefId
router.get('/download/:briefId', (req, res) => {
  try {
    const { briefId } = req.params;
    const row = getBriefRow(briefId);
    if (!row) return res.status(404).json({ error: 'Brief not found' });
    if (!row.pdf_path || !fs.existsSync(row.pdf_path)) {
      return res.status(404).json({ error: 'PDF not yet generated' });
    }
    const safeName = path.basename(row.pdf_path);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
    fs.createReadStream(row.pdf_path).pipe(res);
  } catch (err) {
    console.error('PDF download error:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pdf/regenerate/:briefId
router.post('/regenerate/:briefId', async (req, res) => {
  try {
    const { briefId } = req.params;
    const row = getBriefRow(briefId);
    if (!row) return res.status(404).json({ error: 'Brief not found' });
    if (row.pdf_path && fs.existsSync(row.pdf_path)) {
      try { fs.unlinkSync(row.pdf_path); } catch { /* ignore */ }
    }
    const { generatedAt } = await doGenerate(briefId);
    res.json({ status: 'regenerated', briefId, generatedAt, downloadUrl: `/api/pdf/download/${briefId}` });
  } catch (err) {
    console.error('PDF regenerate error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// GET /api/pdf/status/:briefId
router.get('/status/:briefId', (req, res) => {
  const { briefId } = req.params;
  const row = getBriefRow(briefId);
  if (!row) return res.status(404).json({ error: 'Brief not found' });
  const exists = !!(row.pdf_path && fs.existsSync(row.pdf_path));
  res.json({ exists, generatedAt: row.pdf_generated_at || null });
});

module.exports = router;
