import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { C, FONT_SANS, FONT_MONO, FONT_DISPLAY } from '../tokens.js';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';

const DOC_COLORS = {
  provided:       { bg: '#E8F5EE', fg: C.verified  },
  missing:        { bg: '#F2DEDE', fg: C.halted    },
  to_be_reviewed: { bg: '#F5ECDC', fg: C.pending   },
};

function Section({ coord, title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${C.slate100}` }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.aqua600, letterSpacing: '0.08em' }}>{coord}</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>{value}</div>
    </div>
  );
}

function Grid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0 28px' }}>
      {items.map(([label, value]) => value ? <Field key={label} label={label} value={Array.isArray(value) ? value.join(', ') : value} /> : null)}
    </div>
  );
}

export default function PublicBriefViewer() {
  const { briefId } = useParams();
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/public/brief/${briefId}`)
      .then(r => { if (!r.ok) throw new Error('Brief not found'); return r.json(); })
      .then(setBrief)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [briefId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.slate400 }}>Loading brief…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.halted }}>Brief not found.</span>
        <Link to="/" style={{ fontFamily: FONT_SANS, fontSize: 13, color: C.aqua600 }}>← Return to Issatrix</Link>
      </div>
    );
  }

  const ao  = brief.asset_overview || {};
  const tm  = brief.tokenization_model || {};
  const iam = brief.investor_access_model || {};
  const imd = brief.issuance_matrix_design || {};
  const tc  = brief.technical_configuration || {};
  const docs  = brief.required_documents || [];
  const risks = brief.risks_and_open_questions || [];

  return (
    <div style={{ minHeight: '100vh', background: C.paper }}>
      {/* Minimal header */}
      <div style={{ borderBottom: `1px solid ${C.slate100}`, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.paper, position: 'sticky', top: 0, zIndex: 10 }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 16, color: C.ink, fontWeight: 700 }}>▦</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.ink, letterSpacing: '0.08em' }}>ISSATRIX</span>
        </Link>
        <a href={CONTACT_URL} target="_blank" rel="noreferrer" style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 500, color: C.paper, background: C.aqua600, padding: '7px 16px', borderRadius: 4, textDecoration: 'none' }}>
          Book a structuring call →
        </a>
      </div>

      {/* Cover band */}
      <div style={{ background: C.ink, padding: '48px 32px 40px', borderBottom: `3px solid ${C.aqua600}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.aqua300, letterSpacing: '0.12em', marginBottom: 12 }}>
            ▦ ISSATRIX · TOKENIZATION STRUCTURING BRIEF
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.08, color: C.paper, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            {ao.assetName || brief.project_name || 'Tokenization Brief'}
          </h1>
          <div style={{ fontFamily: FONT_SANS, fontSize: 15, color: 'rgba(245,242,235,0.65)', marginBottom: 20 }}>
            {ao.assetType}{ao.location ? ` · ${ao.location}` : ''}
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontFamily: FONT_MONO, fontSize: 11, color: 'rgba(245,242,235,0.5)', letterSpacing: '0.06em' }}>
            {ao.estimatedValue && <span>VALUE · {ao.estimatedValue}</span>}
            {ao.ownerIssuer && <span>ISSUER · {ao.ownerIssuer}</span>}
            <span>STATUS · {(brief.readiness_score || 'draft').replace(/_/g, ' ').toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Brief content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 32px 80px' }}>

        {/* Asset Overview */}
        <Section coord="01 ·" title="Asset Overview">
          <Grid items={[
            ['Asset Name', ao.assetName],
            ['Asset Type', ao.assetType],
            ['Location', ao.location],
            ['Owner / Issuer', ao.ownerIssuer],
            ['Estimated Value', ao.estimatedValue],
          ]} />
          {ao.description && <Field label="Description" value={ao.description} />}
        </Section>

        {/* Tokenization Model */}
        <Section coord="02 ·" title="Proposed Tokenization Model">
          <Grid items={[
            ['Token Purpose', tm.tokenPurpose],
            ['Ownership Logic', tm.ownershipLogic],
            ['Token Supply', tm.tokenSupplyLogic],
            ['Fractionalization', tm.fractionalizationModel],
            ['Rights Represented', tm.rightsRepresented],
            ['Redemption Logic', tm.redemptionLogic],
          ]} />
        </Section>

        {/* Investor Access */}
        <Section coord="03 ·" title="Investor Access Model">
          <Grid items={[
            ['Investor Type', iam.investorType],
            ['KYC / AML', iam.kycRequirements],
            ['Eligibility Rules', iam.eligibilityRules],
            ['Wallet Whitelisting', iam.walletWhitelistingRequirements],
            ['Transfer Restrictions', iam.transferRestrictions],
            ['Secondary Trading', iam.secondaryTrading],
          ]} />
        </Section>

        {/* Issuance Matrix */}
        <Section coord="04 ·" title="Issuance Matrix Design">
          {imd.description && <Field label="Overview" value={imd.description} />}
          {[...(imd.ownershipCellFields || []), ...(imd.customFields || [])].length > 0 && (
            <div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Ownership Cell Fields</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {[...(imd.ownershipCellFields || []), ...(imd.customFields || [])].map(f => (
                  <span key={f} style={{ fontFamily: FONT_MONO, fontSize: 11, padding: '4px 10px', borderRadius: 4, background: C.slate50, border: `1px solid ${C.slate100}`, color: C.slate600 }}>{f}</span>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Technical Configuration */}
        <Section coord="05 ·" title="Technical Configuration">
          <Grid items={[
            ['Chain Selection', (tc.chainSelection || []).join(', ')],
            ['Smart Contract', tc.smartContractType],
            ['Transfer Control', tc.transferControlModel],
            ['Minting Model', tc.mintingModel],
            ['Redemption Model', tc.redemptionModel],
          ]} />
          {(tc.adminRoles || []).length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Admin Roles</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {tc.adminRoles.map(r => (
                  <span key={r} style={{ fontFamily: FONT_MONO, fontSize: 11, padding: '4px 10px', borderRadius: 4, background: C.slate50, border: `1px solid ${C.slate100}`, color: C.slate600 }}>{r}</span>
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Required Documents */}
        {docs.length > 0 && (
          <Section coord="06 ·" title="Required Documents">
            {docs.map((doc, i) => {
              const { bg, fg } = DOC_COLORS[doc.status] || DOC_COLORS.to_be_reviewed;
              return (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${C.slate50}` }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 10, padding: '3px 8px', borderRadius: 999, background: bg, color: fg, whiteSpace: 'nowrap', marginTop: 2 }}>
                    {doc.status?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <div>
                    <div style={{ fontFamily: FONT_SANS, fontSize: 13.5, color: C.ink, fontWeight: 500 }}>{doc.document}</div>
                    {doc.notes && <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: C.slate500, marginTop: 3 }}>{doc.notes}</div>}
                  </div>
                </div>
              );
            })}
          </Section>
        )}

        {/* Risks */}
        {risks.length > 0 && (
          <Section coord="07 ·" title="Risks & Open Questions">
            <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
              {risks.map((r, i) => (
                <li key={i} style={{ fontFamily: FONT_SANS, fontSize: 13.5, color: C.ink, marginBottom: 10, lineHeight: 1.6 }}>{r}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* Legal notice */}
        <div style={{ padding: '16px 20px', background: C.slate50, borderRadius: 6, border: `1px solid ${C.slate100}`, marginBottom: 40 }}>
          <p style={{ fontFamily: FONT_SANS, fontSize: 12, color: C.slate500, margin: 0, lineHeight: 1.6 }}>
            <strong>Preliminary structuring reference only.</strong> This brief was generated by the Issatrix Asset Structuring Agent and does not constitute legal, financial, or regulatory advice. All sections require independent review by qualified advisors before any tokenization proceeds.
          </p>
        </div>

        {/* CTA */}
        <div style={{ background: C.ink, borderRadius: 6, padding: '36px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, color: C.paper, marginBottom: 8 }}>
              Ready to advance your structuring?
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 14, color: 'rgba(245,242,235,0.65)', maxWidth: 480 }}>
              The Issatrix team will review this brief and send the full Tokenization Structuring Book to your email. Book a call to discuss next steps.
            </div>
          </div>
          <a href={CONTACT_URL} target="_blank" rel="noreferrer" style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 14, color: C.ink, background: C.aqua300, padding: '12px 22px', borderRadius: 4, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Book a structuring call →
          </a>
        </div>
      </div>
    </div>
  );
}
