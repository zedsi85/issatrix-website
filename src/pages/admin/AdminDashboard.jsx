import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { C, FONT_SANS, FONT_MONO, FONT_DISPLAY } from '../../tokens.js';
import { apiGet, apiPost } from '../../lib/api.js';

const STATUS_LABEL = {
  draft:              { label: 'Draft',              color: C.slate400 },
  structuring:        { label: 'Structuring',        color: C.pending },
  compliance_review:  { label: 'Compliance Review',  color: C.aqua600 },
  technical_review:   { label: 'Technical Review',   color: C.aqua700 },
  ready_for_issuance: { label: 'Ready for Issuance', color: C.verified },
};

function StatusDot({ status }) {
  const { label, color } = STATUS_LABEL[status] || STATUS_LABEL.draft;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: FONT_MONO, color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  );
}

function StatCard({ value, label }) {
  return (
    <div style={{ background: C.paper, borderRadius: 6, padding: '20px 24px', border: `1px solid ${C.slate100}` }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: C.ink, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    apiGet('/api/projects')
      .then((data) => setProjects(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function startNewSession() {
    setStarting(true);
    try {
      const { sessionId } = await apiPost('/api/agent/sessions', { projectName: 'New Tokenization Project' });
      navigate(`/admin/agent/${sessionId}`);
    } catch (err) {
      alert(err.message);
      setStarting(false);
    }
  }

  const total = projects.length;
  const withBrief = projects.filter((p) => p.brief_id).length;
  const active = projects.filter((p) => p.session_status === 'active').length;

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36 }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Issatrix · Agent Console
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, color: C.ink, margin: 0 }}>
            Dashboard
          </h1>
        </div>
        <button
          onClick={startNewSession}
          disabled={starting}
          style={{
            height: 40,
            padding: '0 20px',
            background: starting ? C.slate300 : C.ink,
            color: C.paper,
            border: 'none',
            borderRadius: 4,
            fontFamily: FONT_SANS,
            fontSize: 13,
            fontWeight: 500,
            cursor: starting ? 'not-allowed' : 'pointer',
          }}
        >
          {starting ? 'Starting…' : '+ New Asset Structuring'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        <StatCard value={total} label="Total Projects" />
        <StatCard value={withBrief} label="Briefs Generated" />
        <StatCard value={active} label="Active Sessions" />
      </div>

      {/* Projects table */}
      <div style={{ background: C.paper, borderRadius: 6, border: `1px solid ${C.slate100}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.slate100}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 500, color: C.ink }}>Projects</span>
          <Link to="/admin/projects" style={{ fontSize: 12, color: C.aqua600, textDecoration: 'none', fontFamily: FONT_MONO }}>
            View all →
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.slate400, fontSize: 13 }}>Loading…</div>
        ) : projects.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: C.slate400, marginBottom: 16 }}>
              No projects yet. Start by structuring your first asset.
            </div>
            <button
              onClick={startNewSession}
              style={{ height: 36, padding: '0 18px', background: C.aqua600, color: C.paper, border: 'none', borderRadius: 4, fontFamily: FONT_SANS, fontSize: 13, cursor: 'pointer' }}
            >
              Launch Asset Structuring Agent
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.slate100}` }}>
                {['Project', 'Status', 'Brief', 'Created'].map((h) => (
                  <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 8).map((p) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${C.slate50}` }}>
                  <td style={{ padding: '14px 24px' }}>
                    <Link
                      to={p.brief_id ? `/admin/projects/${p.id}` : `/admin/agent/${p.session_id}`}
                      style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 500, color: C.ink, textDecoration: 'none' }}
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <StatusDot status={p.status} />
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    {p.brief_id ? (
                      <Link to={`/admin/projects/${p.id}`} style={{ fontSize: 12, fontFamily: FONT_MONO, color: C.aqua600, textDecoration: 'none' }}>
                        View brief →
                      </Link>
                    ) : (
                      <span style={{ fontSize: 12, fontFamily: FONT_MONO, color: C.slate300 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 24px', fontFamily: FONT_MONO, fontSize: 11, color: C.slate400 }}>
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
