import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { C, FONT_SANS, FONT_MONO, FONT_DISPLAY } from '../../tokens.js';
import { apiGet, apiPost } from '../../lib/api.js';

function MessageBubble({ role, content }) {
  const isAgent = role === 'assistant';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isAgent ? 'flex-start' : 'flex-end',
      marginBottom: 16,
    }}>
      <div style={{
        maxWidth: '72%',
        padding: '14px 18px',
        borderRadius: isAgent ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        background: isAgent ? C.paper : C.ink,
        color: isAgent ? C.ink : C.paper,
        border: isAgent ? `1px solid ${C.slate100}` : 'none',
        fontFamily: FONT_SANS,
        fontSize: 14,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {isAgent && (
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.aqua600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Asset Structuring Agent
          </div>
        )}
        {content}
      </div>
    </div>
  );
}

function BriefGeneratedBanner({ projectId }) {
  return (
    <div style={{
      margin: '8px 0 16px',
      padding: '16px 20px',
      background: '#E8F5EE',
      border: `1px solid #B8DEC9`,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    }}>
      <div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600, color: C.verified, marginBottom: 2 }}>
          Tokenization Brief generated
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: C.verified }}>
          The brief has been saved and attached to this project.
        </div>
      </div>
      <Link
        to={`/admin/projects/${projectId}`}
        style={{
          height: 34,
          padding: '0 16px',
          background: C.verified,
          color: '#fff',
          borderRadius: 4,
          fontFamily: FONT_SANS,
          fontSize: 13,
          fontWeight: 500,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        View Brief →
      </Link>
    </div>
  );
}

export default function AgentChat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [briefGenerated, setBriefGenerated] = useState(false);
  const [projectId, setProjectId] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Create new session if "new"
  useEffect(() => {
    if (sessionId === 'new') {
      apiPost('/api/agent/sessions', { projectName: 'New Tokenization Project' })
        .then(({ sessionId: newId }) => navigate(`/admin/agent/${newId}`, { replace: true }))
        .catch((err) => setError(err.message));
    }
  }, [sessionId, navigate]);

  // Load session
  useEffect(() => {
    if (!sessionId || sessionId === 'new') return;

    setLoading(true);
    apiGet(`/api/agent/sessions/${sessionId}`)
      .then((data) => {
        setSession(data);
        setProjectId(data.project_id);
        setBriefGenerated(data.status === 'completed');

        if (data.messages && data.messages.length > 0) {
          const visible = data.messages.filter((m) => m.role === 'assistant');
          if (visible.length > 0) {
            setMessages(data.messages);
            setLoading(false);
            return;
          }
        }

        // Start agent greeting
        return apiPost('/api/agent/start', { sessionId })
          .then((res) => {
            setMessages([{ role: 'assistant', content: res.message }]);
          })
          .catch((err) => setError(err.message))
          .finally(() => setLoading(false));
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || sending || briefGenerated) return;

    const userMsg = input.trim();
    setInput('');
    setSending(true);
    setError('');

    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);

    try {
      const res = await apiPost('/api/agent/chat', { sessionId, message: userMsg });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.message }]);
      if (res.briefGenerated) {
        setBriefGenerated(true);
      }
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.slice(0, -1));
      setInput(userMsg);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  const displayMessages = messages.filter((m) => m.role !== 'user' || messages.indexOf(m) > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{
        padding: '0 32px',
        height: 56,
        borderBottom: `1px solid ${C.slate100}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: C.paper,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/admin" style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, textDecoration: 'none' }}>
            ← Dashboard
          </Link>
          <span style={{ color: C.slate200 }}>|</span>
          <div>
            <span style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 500, color: C.ink }}>
              {session?.project_name || 'Asset Structuring Agent'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {briefGenerated && projectId && (
            <Link
              to={`/admin/projects/${projectId}`}
              style={{ height: 30, padding: '0 14px', background: C.verified, color: '#fff', borderRadius: 4, fontFamily: FONT_SANS, fontSize: 12, fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              View Brief
            </Link>
          )}
          <span style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: briefGenerated ? C.verified : C.aqua600,
            background: briefGenerated ? '#E8F5EE' : C.aqua50,
            padding: '3px 8px',
            borderRadius: 999,
          }}>
            {briefGenerated ? 'Completed' : 'Active'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.slate400 }}>Starting agent…</div>
          </div>
        ) : (
          <>
            {displayMessages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
            {sending && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                <div style={{ padding: '14px 18px', background: C.paper, border: `1px solid ${C.slate100}`, borderRadius: '4px 14px 14px 14px' }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.aqua600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    Asset Structuring Agent
                  </div>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.slate400 }}>Thinking…</span>
                </div>
              </div>
            )}
            {briefGenerated && projectId && <BriefGeneratedBanner projectId={projectId} />}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 32px',
        borderTop: `1px solid ${C.slate100}`,
        background: C.paper,
        flexShrink: 0,
      }}>
        {error && (
          <div style={{ fontSize: 12, color: C.halted, marginBottom: 10, fontFamily: FONT_SANS }}>
            {error}
          </div>
        )}
        {briefGenerated ? (
          <div style={{ textAlign: 'center', fontFamily: FONT_SANS, fontSize: 13, color: C.slate400, padding: '8px 0' }}>
            Session complete. {projectId && <Link to={`/admin/projects/${projectId}`} style={{ color: C.aqua600 }}>View the generated brief →</Link>}
          </div>
        ) : (
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: 10 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your response…"
              disabled={sending || loading}
              style={{
                flex: 1,
                height: 44,
                padding: '0 16px',
                border: `1px solid ${C.slate200}`,
                borderRadius: 6,
                fontFamily: FONT_SANS,
                fontSize: 14,
                color: C.ink,
                background: C.bone,
                outline: 'none',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
            />
            <button
              type="submit"
              disabled={sending || loading || !input.trim()}
              style={{
                height: 44,
                padding: '0 20px',
                background: (!input.trim() || sending || loading) ? C.slate200 : C.ink,
                color: (!input.trim() || sending || loading) ? C.slate400 : C.paper,
                border: 'none',
                borderRadius: 6,
                fontFamily: FONT_SANS,
                fontSize: 13,
                fontWeight: 500,
                cursor: (!input.trim() || sending || loading) ? 'not-allowed' : 'pointer',
                transition: 'background 100ms',
              }}
            >
              Send
            </button>
          </form>
        )}
        <div style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 10, color: C.slate300, textAlign: 'center' }}>
          Issatrix Asset Structuring Agent · Not legal or financial advice · All outputs require human review
        </div>
      </div>
    </div>
  );
}
