import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { C, FONT_SANS, FONT_MONO, FONT_DISPLAY } from '../../tokens.js';
import { apiGet, apiPost } from '../../lib/api.js';

const STATUS_COLORS = {
  draft:              { bg: C.slate100,  fg: C.slate500 },
  structuring:        { bg: '#F5ECDC',   fg: C.pending },
  compliance_review:  { bg: C.aqua50,    fg: C.aqua700 },
  technical_review:   { bg: C.aqua50,    fg: C.aqua600 },
  ready_for_issuance: { bg: '#E8F5EE',   fg: C.verified },
};

const STATUS_LABEL = {
  draft: 'Draft', structuring: 'Structuring',
  compliance_review: 'Compliance Review',
  technical_review: 'Technical Review',
  ready_for_issuance: 'Ready for Issuance',
};

function StatusBadge({ status }) {
  const { bg, fg } = STATUS_COLORS[status] || STATUS_COLORS.draft;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 10px', borderRadius: 999, background: bg, fontFamily: FONT_MONO, fontSize: 10, color: fg, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    apiGet('/api/projects')
      .then((data) => setProjects(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function startNew() {
    setStarting(true);
    try {
      const { sessionId } = await apiPost('/api/agent/sessions', { projectName: 'New Tokenization Project' });
      navigate(`/admin/agent/${sessionId}`);
    } catch (err) {
      alert(err.message);
      setStarting(false);
    }
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            <Link to="/admin" style={{ color: C.slate400, textDecoration: 'none' }}>Dashboard</Link> · Projects
          </div>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, color: C.ink, margin: 0 }}>All Projects</h1>
        </div>
        <button
          onClick={startNew}
          disabled={starting}
          style={{ height: 40, padding: '0 20px', background: starting ? C.slate300 : C.ink, color: C.paper, border: 'none', borderRadius: 4, fontFamily: FONT_SANS, fontSize: 13, fontWeight: 500, cursor: starting ? 'not-allowed' : 'pointer' }}
        >
          {starting ? 'Starting…' : '+ New Asset Structuring'}
        </button>
      </div>

      <div style={{ background: C.paper, borderRadius: 6, border: `1px solid ${C.slate100}`, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: C.slate400, fontSize: 13, fontFamily: FONT_SANS }}>Loading…</div>
        ) : projects.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: C.slate400, fontFamily: FONT_SANS, marginBottom: 16 }}>No projects yet.</div>
            <button onClick={startNew} style={{ height: 36, padding: '0 18px', background: C.aqua600, color: C.paper, border: 'none', borderRadius: 4, fontFamily: FONT_SANS, fontSize: 13, cursor: 'pointer' }}>
              Launch Asset Structuring Agent
            </button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.slate100}` }}>
                {['Project', 'Status', 'Brief', 'Asset Type', 'Created'].map((h) => (
                  <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${C.slate50}` }}>
                  <td style={{ padding: '14px 24px' }}>
                    <Link
                      to={p.brief_id ? `/admin/projects/${p.id}` : (p.session_id ? `/admin/agent/${p.session_id}` : '/admin')}
                      style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 500, color: C.ink, textDecoration: 'none' }}
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <StatusBadge status={p.status} />
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    {p.brief_id ? (
                      <Link to={`/admin/projects/${p.id}`} style={{ fontSize: 12, fontFamily: FONT_MONO, color: C.aqua600, textDecoration: 'none' }}>
                        View →
                      </Link>
                    ) : (
                      <span style={{ fontSize: 12, fontFamily: FONT_MONO, color: C.slate300 }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 24px', fontFamily: FONT_SANS, fontSize: 12, color: C.slate500 }}>
                    {p.asset_type || '—'}
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
