import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { C, FONT_SANS, FONT_MONO, FONT_DISPLAY } from '../../tokens.js';
import { apiGet, apiPatch } from '../../lib/api.js';

const STATUS_OPTIONS = [
  { value: 'draft',              label: 'Draft' },
  { value: 'structuring',        label: 'Structuring' },
  { value: 'compliance_review',  label: 'Compliance Review' },
  { value: 'technical_review',   label: 'Technical Review' },
  { value: 'ready_for_issuance', label: 'Ready for Issuance' },
];

const STATUS_COLORS = {
  draft:              { bg: C.slate100,  fg: C.slate500 },
  structuring:        { bg: '#F5ECDC',   fg: C.pending },
  compliance_review:  { bg: C.aqua50,    fg: C.aqua700 },
  technical_review:   { bg: C.aqua50,    fg: C.aqua600 },
  ready_for_issuance: { bg: '#E8F5EE',   fg: C.verified },
};

const DOC_STATUS_COLORS = {
  provided:        { bg: '#E8F5EE', fg: C.verified },
  missing:         { bg: '#F2DEDE', fg: C.halted },
  to_be_reviewed:  { bg: '#F5ECDC', fg: C.pending },
};

function SectionCard({ title, children }) {
  return (
    <div style={{ background: C.paper, borderRadius: 6, border: `1px solid ${C.slate100}`, marginBottom: 16 }}>
      <div style={{ padding: '14px 24px', borderBottom: `1px solid ${C.slate100}` }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.slate500, fontWeight: 500 }}>
          {title}
        </span>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 14, color: C.ink, lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function FieldGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0 32px' }}>
      {items.map(([label, value]) => <Field key={label} label={label} value={value} />)}
    </div>
  );
}

function StatusBadge({ status }) {
  const { bg, fg } = STATUS_COLORS[status] || STATUS_COLORS.draft;
  const label = STATUS_OPTIONS.find((o) => o.value === status)?.label || status;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 26, padding: '0 12px', borderRadius: 999, background: bg, fontFamily: FONT_MONO, fontSize: 11, color: fg, letterSpacing: '0.04em' }}>
      {label}
    </span>
  );
}

export default function BriefViewer() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    apiGet(`/api/projects/${projectId}`)
      .then(setProject)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  async function updateStatus(newStatus) {
    setUpdatingStatus(true);
    try {
      await apiPatch(`/api/projects/${projectId}/status`, { status: newStatus });
      setProject((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  function downloadJson() {
    const data = project?.brief?.raw_json || {};
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-brief.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return <div style={{ padding: 48, fontFamily: FONT_SANS, fontSize: 13, color: C.slate400 }}>Loading…</div>;
  }
  if (error) {
    return <div style={{ padding: 48, fontFamily: FONT_SANS, fontSize: 13, color: C.halted }}>{error}</div>;
  }
  if (!project) return null;

  const brief = project.brief;
  const ao = brief?.asset_overview || {};
  const tm = brief?.tokenization_model || {};
  const iam = brief?.investor_access_model || {};
  const imd = brief?.issuance_matrix_design || {};
  const tc = brief?.technical_configuration || {};
  const docs = brief?.required_documents || [];
  const risks = brief?.risks_and_open_questions || [];

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Link to="/admin" style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, textDecoration: 'none' }}>
            ← Dashboard
          </Link>
          {project.session?.id && (
            <>
              <span style={{ color: C.slate200 }}>|</span>
              <Link to={`/admin/agent/${project.session.id}`} style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, textDecoration: 'none' }}>
                View session
              </Link>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              Tokenization Brief
            </div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, color: C.ink, margin: '0 0 10px' }}>
              {project.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <StatusBadge status={project.status} />
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400 }}>
                Generated by Asset Structuring Agent · {project.brief?.created_at ? new Date(project.brief.created_at).toLocaleDateString() : ''}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <select
              value={project.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updatingStatus}
              style={{
                height: 34, padding: '0 10px', border: `1px solid ${C.slate200}`,
                borderRadius: 4, fontFamily: FONT_SANS, fontSize: 12, color: C.ink,
                background: C.paper, cursor: 'pointer',
              }}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            {brief && (
              <button
                onClick={downloadJson}
                style={{ height: 34, padding: '0 14px', border: `1px solid ${C.slate200}`, borderRadius: 4, fontFamily: FONT_SANS, fontSize: 12, fontWeight: 500, color: C.ink, background: C.paper, cursor: 'pointer' }}
              >
                Export JSON
              </button>
            )}
          </div>
        </div>
      </div>

      {!brief ? (
        <div style={{ background: C.paper, borderRadius: 6, border: `1px solid ${C.slate100}`, padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: C.slate400, marginBottom: 16 }}>No brief has been generated for this project yet.</div>
          {project.session?.id && (
            <Link to={`/admin/agent/${project.session.id}`} style={{ fontSize: 13, color: C.aqua600 }}>
              Continue the agent session →
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* 1. Asset Overview */}
          <SectionCard title="01 · Asset Overview">
            <FieldGrid items={[
              ['Asset Name', ao.assetName],
              ['Asset Type', ao.assetType],
              ['Location', ao.location],
              ['Owner / Issuer', ao.ownerIssuer],
              ['Estimated Value', ao.estimatedValue],
            ]} />
            {ao.description && (
              <div style={{ marginTop: 4 }}>
                <Field label="Description" value={ao.description} />
              </div>
            )}
          </SectionCard>

          {/* 2. Tokenization Model */}
          <SectionCard title="02 · Proposed Tokenization Model">
            <FieldGrid items={[
              ['Token Purpose', tm.tokenPurpose],
              ['Ownership Logic', tm.ownershipLogic],
              ['Token Supply Logic', tm.tokenSupplyLogic],
              ['Fractionalization Model', tm.fractionalizationModel],
              ['Rights Represented', tm.rightsRepresented],
              ['Redemption Logic', tm.redemptionLogic],
            ]} />
          </SectionCard>

          {/* 3. Investor Access Model */}
          <SectionCard title="03 · Investor Access Model">
            <FieldGrid items={[
              ['Investor Type', iam.investorType],
              ['KYC Requirements', iam.kycRequirements],
              ['Eligibility Rules', iam.eligibilityRules],
              ['Wallet Whitelisting', iam.walletWhitelistingRequirements],
              ['Transfer Restrictions', iam.transferRestrictions],
              ['Secondary Trading', iam.secondaryTrading],
            ]} />
          </SectionCard>

          {/* 4. Issuance Matrix Design */}
          <SectionCard title="04 · Issuance Matrix Design">
            {imd.description && <Field label="Overview" value={imd.description} />}
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Ownership Cell Fields
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[...(imd.ownershipCellFields || []), ...(imd.customFields || [])].map((f) => (
                <span key={f} style={{ fontFamily: FONT_MONO, fontSize: 11, padding: '4px 10px', borderRadius: 4, background: C.slate50, border: `1px solid ${C.slate100}`, color: C.slate600 }}>
                  {f}
                </span>
              ))}
            </div>
          </SectionCard>

          {/* 5. Required Documents */}
          {docs.length > 0 && (
            <SectionCard title="05 · Required Documents">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Document', 'Status', 'Notes'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 0 10px', fontWeight: 400 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, i) => {
                    const { bg, fg } = DOC_STATUS_COLORS[doc.status] || DOC_STATUS_COLORS.to_be_reviewed;
                    return (
                      <tr key={i} style={{ borderTop: `1px solid ${C.slate50}` }}>
                        <td style={{ padding: '10px 0', fontFamily: FONT_SANS, fontSize: 13, color: C.ink }}>{doc.document}</td>
                        <td style={{ padding: '10px 16px 10px 0' }}>
                          <span style={{ fontFamily: FONT_MONO, fontSize: 10, padding: '3px 8px', borderRadius: 999, background: bg, color: fg, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {doc.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td style={{ padding: '10px 0', fontFamily: FONT_SANS, fontSize: 12, color: C.slate500 }}>{doc.notes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </SectionCard>
          )}

          {/* 6. Technical Configuration */}
          <SectionCard title="06 · Technical Configuration">
            <FieldGrid items={[
              ['Chain Selection', (tc.chainSelection || []).join(', ')],
              ['Smart Contract Type', tc.smartContractType],
              ['Transfer Control Model', tc.transferControlModel],
              ['Minting Model', tc.mintingModel],
              ['Redemption Model', tc.redemptionModel],
              ['Dashboard Requirements', tc.dashboardRequirements],
            ]} />
            {tc.adminRoles?.length > 0 && (
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Admin Roles
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {tc.adminRoles.map((r) => (
                    <span key={r} style={{ fontFamily: FONT_MONO, fontSize: 11, padding: '4px 10px', borderRadius: 4, background: C.slate50, border: `1px solid ${C.slate100}`, color: C.slate600 }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          {/* 7. Risks & Open Questions */}
          {risks.length > 0 && (
            <SectionCard title="07 · Risks & Open Questions">
              <ul style={{ margin: 0, padding: '0 0 0 18px' }}>
                {risks.map((r, i) => (
                  <li key={i} style={{ fontFamily: FONT_SANS, fontSize: 13, color: C.ink, marginBottom: 10, lineHeight: 1.6 }}>
                    {r}
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}

          {/* Legal notice */}
          <div style={{ marginTop: 24, padding: '16px 20px', background: C.slate50, borderRadius: 6, border: `1px solid ${C.slate100}` }}>
            <p style={{ fontFamily: FONT_SANS, fontSize: 12, color: C.slate500, margin: 0, lineHeight: 1.6 }}>
              <strong>Important:</strong> This Tokenization Brief was generated by the Issatrix Asset Structuring Agent and represents a preliminary structural outline only. It does not constitute legal advice, financial advice, or a compliance certification. All sections require independent review by qualified legal, regulatory, and financial advisors before any tokenization project proceeds.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
