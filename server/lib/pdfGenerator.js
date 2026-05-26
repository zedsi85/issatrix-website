const PDFDocument = require('pdfkit');

// ── Layout constants ─────────────────────────────────────────────────────────
const W  = 595.28;   // A4 width (pt)
const H  = 841.89;   // A4 height (pt)
const M  = 52;       // page margin
const CW = W - 2*M; // content width ≈ 491pt

// ── Brand palette ────────────────────────────────────────────────────────────
const INK     = '#0A1920';
const PAPER   = '#F5F2EB';
const AQUA6   = '#1F6F7A';
const AQUA3   = '#6BAAB2';
const SL5     = '#677890';
const SL3     = '#B8C4D0';
const SL1     = '#EBF0F5';
const WARN_BG = '#FEF3C7';
const WARN_FG = '#92400E';
const ERR_BG  = '#FEE2E2';
const ERR_FG  = '#991B1B';
const OK_BG   = '#D1FAE5';
const OK_FG   = '#065F46';

// ── Utilities ────────────────────────────────────────────────────────────────

function safe(v) {
  if (v === null || v === undefined) return '—';
  if (Array.isArray(v)) return v.join(', ') || '—';
  return String(v).trim() || '—';
}

function readinessLabel(score) {
  const map = {
    draft:              'Draft',
    structuring:        'Structuring',
    compliance_review:  'Compliance Review',
    technical_review:   'Technical Review',
    ready_for_issuance: 'Ready for Issuance',
  };
  return map[score] || score || 'Draft';
}

function docStatusStyle(status) {
  if (status === 'provided')       return { bg: OK_BG,   fg: OK_FG,   label: 'PROVIDED'  };
  if (status === 'missing')        return { bg: ERR_BG,  fg: ERR_FG,  label: 'MISSING'   };
  return                                  { bg: WARN_BG, fg: WARN_FG, label: 'TO REVIEW' };
}

// ── Drawing helpers ──────────────────────────────────────────────────────────

function hRule(doc, y, color) {
  doc.moveTo(M, y).lineTo(W - M, y)
     .strokeColor(color || SL3).lineWidth(0.4).stroke();
}

function addContentPage(doc, coord, title) {
  doc.addPage({ size: [W, H], margins: { top: 0, left: 0, right: 0, bottom: 0 } });
  doc.rect(0, 0, W, 4).fill(AQUA6);
  doc.font('Courier').fontSize(9).fillColor(AQUA6).text(coord, M, 24, { width: CW });
  doc.font('Helvetica-Bold').fontSize(17).fillColor(INK).text(title, M, 36, { width: CW });
  hRule(doc, 66);
  return 80;
}

function para(doc, text, y, opts) {
  const { color = INK, size = 11, font = 'Helvetica', lineGap = 3, width = CW } = opts || {};
  doc.font(font).fontSize(size).fillColor(color).lineGap(lineGap)
     .text(safe(text), M, y, { width, align: 'justify' });
  return doc.y + 8;
}

function subHead(doc, text, y) {
  doc.font('Helvetica-Bold').fontSize(11).fillColor(INK)
     .text(text, M, y + 4, { width: CW });
  return doc.y + 5;
}

function fieldRow(doc, label, value, y) {
  doc.font('Courier').fontSize(8).fillColor(SL5)
     .text(label.toUpperCase(), M, y, { width: 145, lineBreak: false });
  doc.font('Helvetica').fontSize(10).fillColor(INK)
     .text(safe(value), M + 150, y, { width: CW - 150 });
  return doc.y + 5;
}

function callout(doc, text, y, type) {
  const bg = type === 'caution' ? WARN_BG : type === 'legal' ? ERR_BG : SL1;
  const fg = type === 'caution' ? WARN_FG : type === 'legal' ? ERR_FG : AQUA6;
  const charPerLine = Math.floor((CW - 36) / 5.8);
  const lines = Math.ceil(text.length / charPerLine);
  const boxH = Math.max(38, lines * 13 + 20);
  doc.rect(M, y, CW, boxH).fill(bg);
  doc.rect(M, y, 3, boxH).fill(fg);
  doc.font('Helvetica').fontSize(9.5).fillColor(fg)
     .text(text, M + 14, y + 10, { width: CW - 20, lineGap: 2 });
  return Math.max(y + boxH + 10, doc.y + 10);
}

function bullets(doc, items, y, opts) {
  const { size = 10.5, color = INK } = opts || {};
  if (!items || items.length === 0) return y;
  for (const item of items) {
    const t = safe(item);
    doc.font('Helvetica').fontSize(size).fillColor(SL5)
       .text('–', M, y, { width: 12, lineBreak: false });
    doc.font('Helvetica').fontSize(size).fillColor(color)
       .text(t, M + 16, y, { width: CW - 16 });
    y = doc.y + 3;
  }
  return y + 4;
}

function addFooter(doc, pageIdx, total) {
  doc.switchToPage(pageIdx);
  const fy = H - 32;
  hRule(doc, fy - 6, SL3);
  doc.font('Courier').fontSize(7.5).fillColor(SL5)
     .text('ISSATRIX — CONFIDENTIAL  ·  NOT FOR DISTRIBUTION', M, fy, { width: CW / 2 });
  doc.font('Courier').fontSize(7.5).fillColor(SL5)
     .text(`PAGE ${pageIdx + 1} OF ${total}`, M + CW / 2, fy, { width: CW / 2, align: 'right' });
}

// ── Cover page ───────────────────────────────────────────────────────────────

function coverPage(doc, brief) {
  const ao    = brief.asset_overview || {};
  const score = brief.readiness_score || 'draft';
  const date  = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  doc.rect(0, 0, W, H).fill(INK);
  doc.rect(0, 0, W, 5).fill(AQUA6);

  // Wordmark
  doc.font('Courier').fontSize(11).fillColor(AQUA3)
     .text('▦  ISSATRIX', M, 36, { width: CW });

  // Doc label
  doc.font('Courier').fontSize(8).fillColor(AQUA3)
     .text('TOKENIZATION STRUCTURING BOOK  ·  CONFIDENTIAL', M, 56, { width: CW, opacity: 0.7 });

  // Separator
  doc.moveTo(M, 84).lineTo(W - M, 84).strokeColor(AQUA6).lineWidth(0.5).stroke();

  // Asset name
  doc.font('Times-Roman').fontSize(46).fillColor(PAPER).lineGap(4)
     .text(safe(ao.assetName), M, 106, { width: CW });

  // Asset type tag
  doc.font('Helvetica').fontSize(15).fillColor(AQUA3)
     .text(safe(ao.assetType), M, doc.y + 10, { width: CW });

  // Detail grid
  const dy = doc.y + 30;
  doc.moveTo(M, dy).lineTo(W - M, dy).strokeColor(AQUA6).lineWidth(0.4).stroke();

  const col2  = W / 2 + 6;
  const colW  = W / 2 - M - 6;
  let yl = dy + 18;
  let yr = dy + 18;

  function detail(label, value, x, y) {
    doc.font('Courier').fontSize(8).fillColor(AQUA3)
       .text(label, x, y, { width: colW });
    doc.font('Helvetica').fontSize(11).fillColor(PAPER)
       .text(safe(value), x, doc.y + 2, { width: colW });
    return doc.y + 14;
  }

  yl = detail('ISSUER / OWNER', ao.ownerIssuer, M, yl);
  yl = detail('LOCATION', ao.location, M, yl);
  yr = detail('ESTIMATED VALUE', ao.estimatedValue, col2, yr);
  yr = detail('READINESS STATUS', readinessLabel(score), col2, yr);

  // Footer
  const fTop = H - 88;
  doc.moveTo(M, fTop).lineTo(W - M, fTop).strokeColor(AQUA6).lineWidth(0.3).stroke();
  doc.font('Courier').fontSize(8).fillColor(AQUA3)
     .text(`PREPARED BY ISSATRIX ASSET STRUCTURING AGENT  ·  ${date.toUpperCase()}`, M, fTop + 12, { width: CW });
  doc.font('Helvetica').fontSize(8).fillColor(AQUA3)
     .text('This document is a preliminary structuring reference only. It does not constitute legal, financial, or regulatory advice. All sections require independent review by qualified advisors before any tokenization proceeds.', M, fTop + 28, { width: CW, lineGap: 2 });
}

// ── TOC ──────────────────────────────────────────────────────────────────────

function tocPage(doc, sections) {
  doc.addPage({ size: [W, H], margins: { top: 0, left: 0, right: 0, bottom: 0 } });
  doc.rect(0, 0, W, 4).fill(AQUA6);
  doc.font('Courier').fontSize(9).fillColor(AQUA6).text('MX·00', M, 24);
  doc.font('Helvetica-Bold').fontSize(17).fillColor(INK).text('Contents', M, 36, { width: CW });
  hRule(doc, 66);

  let y = 82;
  sections.forEach((s, i) => {
    doc.font('Courier').fontSize(9).fillColor(AQUA6)
       .text(String(i + 1).padStart(2, '0'), M, y, { width: 28, lineBreak: false });
    doc.font('Helvetica').fontSize(11).fillColor(INK)
       .text(s, M + 34, y, { width: CW - 34 });
    y = doc.y + 4;
    if (i < sections.length - 1)
      doc.moveTo(M + 34, y).lineTo(W - M, y).strokeColor(SL1).lineWidth(0.4).stroke();
    y += 6;
  });
}

// ── Content sections ─────────────────────────────────────────────────────────

function sectionExecutiveSummary(doc, narrative) {
  const y = addContentPage(doc, 'MX·01', 'Executive Summary');
  para(doc, narrative.executiveSummary, y, { size: 11.5, lineGap: 4 });
}

function sectionAssetOverview(doc, brief) {
  let y = addContentPage(doc, 'MX·02', 'Asset Overview');
  const ao = brief.asset_overview || {};
  y = fieldRow(doc, 'Asset Name', ao.assetName, y);
  y = fieldRow(doc, 'Asset Type', ao.assetType, y);
  y = fieldRow(doc, 'Location', ao.location, y);
  y = fieldRow(doc, 'Owner / Issuer', ao.ownerIssuer, y);
  y = fieldRow(doc, 'Estimated Value', ao.estimatedValue, y);
  y += 8; hRule(doc, y); y += 12;
  y = subHead(doc, 'Asset Description', y);
  para(doc, ao.description, y);
}

function sectionTokenizationThesis(doc, narrative) {
  const y = addContentPage(doc, 'MX·03', 'Tokenization Thesis');
  para(doc, narrative.tokenizationThesis, y, { size: 11.5, lineGap: 4 });
}

function sectionTokenizationModel(doc, brief) {
  let y = addContentPage(doc, 'MX·04', 'Proposed Tokenization Model');
  const tm = brief.tokenization_model || {};
  y = fieldRow(doc, 'Token Purpose', tm.tokenPurpose, y);
  y = fieldRow(doc, 'Ownership Logic', tm.ownershipLogic, y);
  y = fieldRow(doc, 'Token Supply', tm.tokenSupplyLogic, y);
  y = fieldRow(doc, 'Fractionalization', tm.fractionalizationModel, y);
  y = fieldRow(doc, 'Rights Represented', tm.rightsRepresented, y);
  fieldRow(doc, 'Redemption Logic', tm.redemptionLogic, y);
}

function sectionIssuanceMatrix(doc, brief, narrative) {
  let y = addContentPage(doc, 'MX·05', 'Issuance Matrix Design');
  const imd = brief.issuance_matrix_design || {};
  y = para(doc, narrative.issuanceMatrixExplanation, y, { size: 11 });
  y += 4; hRule(doc, y); y += 12;
  y = subHead(doc, 'Standard Ownership Cell Fields', y);
  y = bullets(doc, imd.ownershipCellFields || [], y);
  if ((imd.customFields || []).length > 0) {
    y = subHead(doc, 'Project-Specific Custom Fields', y);
    bullets(doc, imd.customFields, y);
  }
}

function sectionInvestorAccess(doc, brief) {
  let y = addContentPage(doc, 'MX·06', 'Investor Access Model');
  const iam = brief.investor_access_model || {};
  y = fieldRow(doc, 'Investor Type', iam.investorType, y);
  y = fieldRow(doc, 'KYC / AML', iam.kycRequirements, y);
  y = fieldRow(doc, 'Eligibility Rules', iam.eligibilityRules, y);
  y = fieldRow(doc, 'Wallet Whitelisting', iam.walletWhitelistingRequirements, y);
  y = fieldRow(doc, 'Transfer Restrictions', iam.transferRestrictions, y);
  fieldRow(doc, 'Secondary Trading', iam.secondaryTrading, y);
}

function sectionCompliance(doc, narrative) {
  let y = addContentPage(doc, 'MX·07', 'Compliance & Legal Review Areas');
  y = callout(doc, 'This section identifies areas requiring independent legal review. It does not constitute legal advice or a compliance determination.', y, 'legal');
  para(doc, narrative.complianceOverview, y, { size: 11 });
}

function sectionTechnical(doc, brief) {
  let y = addContentPage(doc, 'MX·08', 'Technical Configuration');
  const tc = brief.technical_configuration || {};
  y = fieldRow(doc, 'Chain Selection', (tc.chainSelection || []).join(', '), y);
  y = fieldRow(doc, 'Smart Contract', tc.smartContractType, y);
  y = fieldRow(doc, 'Transfer Control', tc.transferControlModel, y);
  y = fieldRow(doc, 'Minting Model', tc.mintingModel, y);
  y = fieldRow(doc, 'Redemption Model', tc.redemptionModel, y);
  y = fieldRow(doc, 'Dashboard', tc.dashboardRequirements, y);
  if ((tc.adminRoles || []).length > 0) {
    y += 8; hRule(doc, y); y += 12;
    y = subHead(doc, 'Admin Roles', y);
    bullets(doc, tc.adminRoles, y);
  }
}

function sectionDeFi(doc, narrative) {
  let y = addContentPage(doc, 'MX·09', 'DeFi & Secondary Liquidity Considerations');
  y = callout(doc, 'Tokenization does not guarantee liquidity. Any DeFi integration or secondary market functionality must be reviewed for regulatory compliance before implementation.', y, 'caution');
  para(doc, narrative.defiConsiderations, y, { size: 11 });
}

function sectionDocuments(doc, brief) {
  let y = addContentPage(doc, 'MX·10', 'Required Documents Checklist');
  const docs = brief.required_documents || [];
  if (docs.length === 0) {
    para(doc, 'No documents have been catalogued for this project.', y, { color: SL5 });
    return;
  }
  for (const item of docs) {
    const { bg, fg, label } = docStatusStyle(item.status);
    // Document name
    doc.font('Helvetica-Bold').fontSize(10.5).fillColor(INK)
       .text(safe(item.document), M, y, { width: CW - 88, lineBreak: false });
    // Status badge
    const badgeX = W - M - 80;
    doc.rect(badgeX, y - 1, 80, 16).fill(bg);
    doc.font('Courier').fontSize(8).fillColor(fg)
       .text(label, badgeX, y + 3, { width: 80, align: 'center', lineBreak: false });
    y = doc.y + 3;
    if (item.notes) {
      doc.font('Helvetica').fontSize(9.5).fillColor(SL5)
         .text(safe(item.notes), M + 10, y, { width: CW - 10 });
      y = doc.y + 3;
    }
    y += 8;
    hRule(doc, y - 4, SL1);
  }
}

function sectionRisks(doc, brief, narrative) {
  let y = addContentPage(doc, 'MX·11', 'Risks & Caution Points');
  const risks = brief.risks_and_open_questions || [];
  if (risks.length > 0) {
    y = subHead(doc, 'Open Questions & Identified Risks', y);
    y = bullets(doc, risks, y);
    y += 8; hRule(doc, y); y += 12;
  }
  y = subHead(doc, 'Key Caution Points', y);
  bullets(doc, narrative.cautionPoints || [], y, { color: WARN_FG });
}

function sectionNextSteps(doc, narrative) {
  let y = addContentPage(doc, 'MX·12', 'Suggested Next Steps');
  const steps = narrative.suggestedNextSteps || [];
  for (const phase of steps) {
    // Start a new page if we're running low on space
    if (y > H - 150) {
      doc.addPage({ size: [W, H], margins: { top: 0, left: 0, right: 0, bottom: 0 } });
      doc.rect(0, 0, W, 4).fill(AQUA6);
      y = 24;
    }
    y = subHead(doc, phase.phase, y);
    y = bullets(doc, phase.items || [], y);
    y += 4;
  }
}

function sectionReadiness(doc, brief, narrative) {
  let y = addContentPage(doc, 'MX·13', 'Launch Readiness Assessment');

  const score  = brief.readiness_score || 'draft';
  const stages = ['draft', 'structuring', 'compliance_review', 'technical_review', 'ready_for_issuance'];
  const labels = ['Draft', 'Structuring', 'Compliance', 'Technical', 'Launch Ready'];
  const idx    = stages.indexOf(score);
  const segW   = CW / stages.length;

  // Progress bar
  stages.forEach((_, i) => {
    const active = i <= idx;
    const sx = M + i * segW;
    doc.rect(sx, y, segW - 2, 20).fill(active ? AQUA6 : SL1);
    doc.font('Courier').fontSize(7.5).fillColor(active ? PAPER : SL5)
       .text(labels[i], sx + 2, y + 6, { width: segW - 4, align: 'center', lineBreak: false });
  });

  y += 30;
  doc.font('Helvetica-Bold').fontSize(13).fillColor(AQUA6)
     .text(`Current Stage: ${readinessLabel(score)}`, M, y, { width: CW });
  y = doc.y + 14;
  hRule(doc, y); y += 12;
  para(doc, narrative.launchReadinessExplanation, y, { size: 11 });
}

function sectionDisclaimer(doc) {
  let y = addContentPage(doc, 'MX·14', 'Legal Disclaimer');
  const text = [
    'This Tokenization Structuring Book has been prepared by the Issatrix Asset Structuring Agent for preliminary structuring purposes only. It is intended for the sole use of the asset owner or issuer identified on the cover page and their qualified legal, financial, and technical advisors.',
    'This document does not constitute legal advice, financial advice, regulatory advice, or a compliance certification. No representation is made that the proposed tokenization structure complies with the laws or regulations of any jurisdiction. All compliance assumptions, token classifications, and investor eligibility determinations must be independently reviewed and validated by qualified legal counsel in each applicable jurisdiction.',
    'This document does not constitute an offer or solicitation to sell or purchase any security, token, financial instrument, or investment product of any kind. No reliance should be placed on the contents of this document for investment, legal, or regulatory purposes without independent verification.',
    'The Issatrix platform provides technology infrastructure for the configuration and management of tokenized asset issuances. Issatrix does not act as a legal advisor, compliance officer, transfer agent, or regulated financial institution. Platform functionality does not substitute for the engagement of qualified legal, regulatory, financial, and technical advisors.',
    'All figures, valuations, and projections referenced in this document are based solely on information provided by the user and have not been independently verified by Issatrix.',
    'This document is marked confidential. Reproduction or distribution without prior written consent from Issatrix is prohibited.',
  ].join('\n\n');

  y = para(doc, text, y, { size: 10, color: SL5, lineGap: 3 });
  y += 16;
  doc.font('Helvetica-Bold').fontSize(10).fillColor(INK)
     .text('© Issatrix. All rights reserved.', M, y, { width: CW });
}

// ── Main generator ───────────────────────────────────────────────────────────

async function generatePDF(brief, narrative) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [W, H],
        bufferPages: true,
        autoFirstPage: false,
        margins: { top: 0, left: 0, right: 0, bottom: 0 },
      });

      const chunks = [];
      doc.on('data', c => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const TOC_SECTIONS = [
        'Executive Summary',
        'Asset Overview',
        'Tokenization Thesis',
        'Proposed Tokenization Model',
        'Issuance Matrix Design',
        'Investor Access Model',
        'Compliance & Legal Review Areas',
        'Technical Configuration',
        'DeFi & Secondary Liquidity Considerations',
        'Required Documents Checklist',
        'Risks & Caution Points',
        'Suggested Next Steps',
        'Launch Readiness Assessment',
        'Legal Disclaimer',
      ];

      // Page 0: Cover (no footer)
      doc.addPage({ size: [W, H], margins: { top: 0, left: 0, right: 0, bottom: 0 } });
      coverPage(doc, brief);

      // Page 1: TOC (no footer)
      tocPage(doc, TOC_SECTIONS);

      // Content pages (pages 2+)
      sectionExecutiveSummary(doc, narrative);
      sectionAssetOverview(doc, brief);
      sectionTokenizationThesis(doc, narrative);
      sectionTokenizationModel(doc, brief);
      sectionIssuanceMatrix(doc, brief, narrative);
      sectionInvestorAccess(doc, brief);
      sectionCompliance(doc, narrative);
      sectionTechnical(doc, brief);
      sectionDeFi(doc, narrative);
      sectionDocuments(doc, brief);
      sectionRisks(doc, brief, narrative);
      sectionNextSteps(doc, narrative);
      sectionReadiness(doc, brief, narrative);
      sectionDisclaimer(doc);

      doc.flushPages();
      const { start, count } = doc.bufferedPageRange();

      // Add footers to content pages only (skip cover=0, toc=1)
      for (let i = 2; i < count; i++) {
        addFooter(doc, start + i, count);
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePDF };
