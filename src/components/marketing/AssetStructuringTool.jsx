import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow, Btn } from './Primitives.jsx';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';

function now() {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 24, height: 24, borderRadius: 2, flexShrink: 0, background: C.ink, color: C.paper, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontSize: 11 }}>▦</div>
      <div style={{ padding: '10px 14px', background: C.paper2, border: `1px solid ${C.slate200}`, borderRadius: 6, display: 'inline-flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: C.slate400, animation: `issatrix-typing 1.2s ease-in-out ${i * 0.18}s infinite`, display: 'inline-block' }} />
        ))}
      </div>
      <style>{`@keyframes issatrix-typing { 0%,60%,100%{opacity:.25;transform:translateY(0)}30%{opacity:1;transform:translateY(-2px)} }`}</style>
    </div>
  );
}

function MessageBubble({ m }) {
  if (m.role === 'system') {
    return (
      <div style={{ alignSelf: 'center', maxWidth: '85%', padding: '8px 14px', background: C.paper2, border: `1px solid ${C.slate200}`, borderRadius: 999, fontFamily: FONT_MONO, fontSize: 11, color: C.aqua700, letterSpacing: '0.04em', textAlign: 'center' }}>
        ● {m.text}
      </div>
    );
  }
  const isUser = m.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
      {!isUser && (
        <div style={{ width: 24, height: 24, borderRadius: 2, flexShrink: 0, background: C.ink, color: C.paper, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontSize: 11 }}>▦</div>
      )}
      <div style={{ maxWidth: '78%', padding: '10px 14px', background: isUser ? C.ink : C.paper2, color: isUser ? C.paper : C.ink, border: isUser ? '1px solid transparent' : `1px solid ${C.slate200}`, borderRadius: 6, borderBottomRightRadius: isUser ? 1 : 6, borderBottomLeftRadius: isUser ? 6 : 1, fontFamily: FONT_SANS, fontSize: 14, lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {m.text}
        {m.ts && (
          <div style={{ marginTop: 6, fontFamily: FONT_MONO, fontSize: 9, color: isUser ? 'rgba(245,242,235,0.55)' : C.slate400, letterSpacing: '0.06em' }}>{m.ts}</div>
        )}
      </div>
    </div>
  );
}

// ── ChatFlow — connected to real agent backend ────────────────────────────────

function buildIntakeMessage(intake) {
  return [
    `Hello. I'd like to use the Issatrix Asset Structuring Tool to prepare a tokenization brief for my asset.`,
    ``,
    `My initial details:`,
    `- Full name: ${intake.name}`,
    `- Company: ${intake.company}`,
    `- Contact email: ${intake.email}`,
    `- Phone / contact: ${intake.phone}`,
    `- Asset type: ${intake.type}`,
    `- Estimated value: ${intake.value}`,
    `- Location / Jurisdiction: ${intake.jurisdiction}`,
    `- Asset description: ${intake.description}`,
    ``,
    `Please guide me through the remaining questions needed to complete the tokenization structuring brief.`,
  ].join('\n');
}

function ChatFlow({ intake, onComplete }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(true);
  const [done, setDone] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const sessionResp = await fetch('/api/public/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectName: `${intake.company || intake.name} — ${intake.type}` }),
        });
        if (!sessionResp.ok) throw new Error('Failed to create session');
        const { sessionId: sid } = await sessionResp.json();
        if (cancelled) return;
        setSessionId(sid);

        const chatResp = await fetch('/api/public/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sid, message: buildIntakeMessage(intake) }),
        });
        if (!chatResp.ok) throw new Error('Failed to start conversation');
        const data = await chatResp.json();
        if (cancelled) return;

        setBusy(false);
        setMessages([{ role: 'bot', text: data.message, ts: now() }]);
        if (data.briefGenerated && data.briefId) finalizeBrief(data.briefId);
      } catch (err) {
        if (!cancelled) { setBusy(false); setError('Failed to connect to the structuring tool. Please refresh the page and try again.'); }
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  function finalizeBrief(briefId) {
    setDone(true);
    fetch(`/api/public/pdf/${briefId}`, { method: 'POST' }).catch(() => {});
    setTimeout(() => onComplete && onComplete(briefId), 1000);
  }

  async function sendUser(text) {
    const t = (text || '').trim();
    if (!t || done || busy || !sessionId) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: t, ts: now() }]);
    setBusy(true);
    try {
      const resp = await fetch('/api/public/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: t }),
      });
      if (!resp.ok) throw new Error('Chat error');
      const data = await resp.json();
      setBusy(false);
      setMessages(prev => [...prev, { role: 'bot', text: data.message, ts: now() }]);
      if (data.briefGenerated && data.briefId) {
        setMessages(prev => [...prev, { role: 'system', text: 'Brief generated — preparing your Tokenization Structuring Book.' }]);
        finalizeBrief(data.briefId);
      }
    } catch {
      setBusy(false);
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection error. Please try sending your message again.', ts: now() }]);
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendUser(input); }
  };

  const statusLabel = done ? 'COMPLETE' : busy ? 'THINKING…' : 'GUIDED CHAT';

  return (
    <div style={{ background: C.bone, border: `1px solid ${C.slate200}`, borderRadius: 2, minHeight: 540, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 14px', borderBottom: `1px solid ${C.slate200}`, background: C.paper, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 2, background: C.ink, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: C.paper, fontFamily: FONT_MONO, fontSize: 14, fontWeight: 500 }}>▦</div>
          <div>
            <div style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 14, color: C.ink }}>Issatrix Asset Structuring Tool</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate500, letterSpacing: '0.08em' }}>
              ● {statusLabel} · {(intake.company || intake.name || 'INTAKE').toUpperCase()} · {(intake.type || '').toUpperCase()}
            </div>
          </div>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: done ? C.aqua700 : C.slate400, letterSpacing: '0.04em' }}>
          {done ? '● BRIEF COMPLETE' : '▸ IN PROGRESS'}
        </div>
      </div>

      {/* Thread */}
      <div ref={scrollRef} style={{ flex: 1, padding: '20px 20px 16px', overflowY: 'auto', background: C.bone, maxHeight: 460, minHeight: 360, display: 'flex', flexDirection: 'column', gap: 14, fontFamily: FONT_SANS }}>
        {messages.length === 0 && busy && <TypingIndicator />}
        {messages.map((m, i) => <MessageBubble key={i} m={m} />)}
        {busy && messages.length > 0 && <TypingIndicator />}
        {error && (
          <div style={{ padding: '10px 14px', background: '#F2DEDE', border: '1px solid #E5B8B8', borderRadius: 6, fontFamily: FONT_SANS, fontSize: 13, color: '#8B2020' }}>{error}</div>
        )}
      </div>

      {/* Composer / done bar */}
      {done ? (
        <div style={{ borderTop: `1px solid ${C.slate200}`, background: C.paper, padding: '14px 20px', textAlign: 'center' }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.aqua700, letterSpacing: '0.06em' }}>● BRIEF COMPLETE · PREPARING YOUR STRUCTURING BOOK</span>
        </div>
      ) : (
        <div style={{ borderTop: `1px solid ${C.slate200}`, background: C.paper, padding: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={done || busy || !sessionId}
              placeholder={busy ? 'Agent is thinking…' : 'Type your answer… (Enter to send)'}
              rows={1}
              style={{ flex: 1, resize: 'none', minHeight: 40, maxHeight: 120, padding: '10px 12px', boxSizing: 'border-box', background: C.bone, border: `1px solid ${C.slate200}`, borderRadius: 4, fontFamily: FONT_SANS, fontSize: 14, color: C.ink, outline: 'none', lineHeight: 1.4 }}
            />
            <button
              onClick={() => sendUser(input)}
              disabled={!input.trim() || done || busy || !sessionId}
              style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 13, height: 40, padding: '0 14px', borderRadius: 4, background: (!input.trim() || done || busy || !sessionId) ? C.slate200 : C.ink, color: (!input.trim() || done || busy || !sessionId) ? C.slate400 : C.paper, border: 'none', cursor: (!input.trim() || done || busy || !sessionId) ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}
            >
              Send →
            </button>
          </div>
          <div style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span>▮ Conversation is confidential · stored against your intake</span>
            <span>ENTER · send &nbsp; · &nbsp; SHIFT + ENTER · newline</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AccessForm ────────────────────────────────────────────────────────────────

function AccessForm({ intake, setIntake, onSubmit }) {
  const set = (k, v) => setIntake(prev => ({ ...prev, [k]: v }));
  const required = ['name', 'company', 'email', 'phone', 'jurisdiction', 'description'];
  const valid = required.every(k => intake[k] && intake[k].trim().length > 0)
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(intake.email);

  const inputCss = { width: '100%', height: 40, padding: '0 12px', boxSizing: 'border-box', background: C.bone, border: `1px solid ${C.slate200}`, borderRadius: 4, fontFamily: FONT_SANS, fontSize: 14, color: C.ink, outline: 'none' };
  const selectCss = { ...inputCss, appearance: 'none' };
  const textareaCss = { ...inputCss, height: 96, padding: '10px 12px', lineHeight: 1.5, resize: 'vertical' };
  const labelCss = { fontFamily: FONT_SANS, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.slate500, marginBottom: 6, display: 'block' };

  return (
    <div style={{ background: C.bone, border: `1px solid ${C.slate200}`, borderRadius: 2, padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <Eyebrow coord="◉" color={C.aqua700}>ACCESS</Eyebrow>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 26, lineHeight: 1.15, letterSpacing: '-0.01em', color: C.ink, margin: '12px 0 6px' }}>
          Access the Issatrix Asset Structuring Tool
        </h3>
        <p style={{ fontFamily: FONT_SANS, fontSize: 14, color: C.slate500, margin: 0 }}>
          Start with your basic asset details. After submission, the structuring chat will open and guide you through the next questions.
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); if (valid) onSubmit(); }} noValidate>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><label style={labelCss}>Full name</label><input style={inputCss} value={intake.name} onChange={e => set('name', e.target.value)} placeholder="Jonas Méndez" /></div>
          <div><label style={labelCss}>Company</label><input style={inputCss} value={intake.company} onChange={e => set('company', e.target.value)} placeholder="Aragón Holdings" /></div>
          <div><label style={labelCss}>Work email</label><input type="email" style={inputCss} value={intake.email} onChange={e => set('email', e.target.value)} placeholder="name@company.com" /></div>
          <div><label style={labelCss}>Phone · Telegram · WhatsApp</label><input style={inputCss} value={intake.phone} onChange={e => set('phone', e.target.value)} placeholder="+44 7…  /  @handle" /></div>
          <div>
            <label style={labelCss}>Asset type</label>
            <select style={selectCss} value={intake.type} onChange={e => set('type', e.target.value)}>
              {['Real estate', 'Commodities', 'Water assets', 'Mining / natural resources', 'Collectibles', 'Private credit', 'Infrastructure assets', 'Other'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label style={labelCss}>Estimated asset value</label>
            <select style={selectCss} value={intake.value} onChange={e => set('value', e.target.value)}>
              {['Below $1M', '$1M – $10M', '$10M – $50M', '$50M+', 'Not sure yet'].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}><label style={labelCss}>Asset jurisdiction / location</label><input style={inputCss} value={intake.jurisdiction} onChange={e => set('jurisdiction', e.target.value)} placeholder="e.g. Riyadh, KSA — Mining concession #04" /></div>
          <div style={{ gridColumn: '1 / -1' }}><label style={labelCss}>Short asset description</label><textarea style={textareaCss} value={intake.description} onChange={e => set('description', e.target.value)} placeholder="A few lines about the asset, ownership structure, and tokenization goals." /></div>
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.slate100}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, letterSpacing: '0.04em' }}>▦ MX · INTAKE · CONFIDENTIAL</span>
          <button type="submit" disabled={!valid} style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 14, height: 40, padding: '0 18px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: valid ? 'pointer' : 'not-allowed', background: valid ? C.ink : C.slate200, color: valid ? C.paper : C.slate400, border: '1px solid transparent', whiteSpace: 'nowrap', transition: 'background 120ms cubic-bezier(0.2,0,0,1)' }}>
            Start structuring →
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Confirmation ──────────────────────────────────────────────────────────────

function Confirmation({ email, briefId }) {
  return (
    <div style={{ background: C.ink, color: C.paper, borderRadius: 2, padding: 36, minHeight: 480, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(to right, rgba(245,242,235,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,242,235,0.06) 1px, transparent 1px)`, backgroundSize: '24px 24px', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <Eyebrow coord="● SUBMITTED" color={C.aqua300}>BRIEF · GENERATING BOOK</Eyebrow>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.paper, margin: '20px 0 16px' }}>
          Your Tokenization Structuring Book is being prepared.
        </h3>
        <p style={{ fontFamily: FONT_SANS, fontSize: 16, lineHeight: 1.6, color: 'rgba(245,242,235,0.75)', margin: 0, maxWidth: 480 }}>
          The Issatrix team will review your structuring brief and send the full{' '}
          <span style={{ color: C.paper, fontWeight: 500 }}>Tokenization Structuring Book</span>{' '}
          to{' '}
          <span style={{ color: C.paper, fontFamily: FONT_MONO, fontSize: 14 }}>{email || 'your email'}</span>{' '}
          within one business day.
        </p>
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(245,242,235,0.18)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.06em' }}>
          {[{ k: 'BRIEF', v: 'GENERATED' }, { k: 'BOOK', v: 'GENERATING' }, { k: 'NEXT', v: 'EMAIL DELIVERY' }].map(s => (
            <div key={s.k}><div style={{ color: 'rgba(245,242,235,0.5)' }}>{s.k}</div><div style={{ color: C.paper, marginTop: 4 }}>{s.v}</div></div>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {briefId && (
          <Link
            to={`/brief/${briefId}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: 14, color: C.ink, background: C.aqua300, padding: '10px 18px', borderRadius: 4, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            View your Tokenization Brief →
          </Link>
        )}
        <Btn variant="accent" href={CONTACT_URL}>Book a structuring call</Btn>
      </div>
    </div>
  );
}

// ── StructuringExplainer ──────────────────────────────────────────────────────

function StructuringExplainer() {
  const benefits = [
    { coord: '01', t: 'Structure your asset',                    b: 'Provide key information about your asset, ownership model, jurisdiction, valuation, and tokenization goals.' },
    { coord: '02', t: 'Define the issuance matrix',              b: 'Map the asset into programmable ownership cells linked to investor data, wallet access, compliance status, transfer rules, and lifecycle events.' },
    { coord: '03', t: 'Identify gaps and caution points',        b: 'Surface missing documents, legal-review areas, technical dependencies, and open questions before issuance.' },
    { coord: '04', t: 'Receive a reviewed structuring document', b: 'The Issatrix team reviews your brief and sends the full Tokenization Structuring Book to your email.' },
  ];
  return (
    <div>
      <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 28, lineHeight: 1.15, letterSpacing: '-0.01em', color: C.ink, margin: '0 0 20px' }}>
        A serious structuring process, not a generic chatbot.
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: `1px solid ${C.slate200}`, borderLeft: `1px solid ${C.slate200}` }}>
        {benefits.map(b => (
          <div key={b.coord} style={{ background: C.bone, padding: '20px 20px', borderRight: `1px solid ${C.slate200}`, borderBottom: `1px solid ${C.slate200}` }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.08em' }}>STEP {b.coord}</div>
            <h4 style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 15, color: C.ink, margin: '10px 0 6px' }}>{b.t}</h4>
            <p style={{ fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.55, color: C.slate500, margin: 0 }}>{b.b}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, padding: 16, border: `1px solid ${C.slate200}`, background: C.paper, fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, letterSpacing: '0.06em' }}>
        <div style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: C.slate400, marginBottom: 10 }}>WORKFLOW</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ color: C.ink }}>INTAKE</span><span style={{ color: C.slate300 }}>→</span>
          <span style={{ color: C.ink }}>GUIDED QUESTIONS</span><span style={{ color: C.slate300 }}>→</span>
          <span style={{ color: C.ink }}>BRIEF GENERATED</span><span style={{ color: C.slate300 }}>→</span>
          <span style={{ color: C.ink }}>INTERNAL REVIEW</span><span style={{ color: C.slate300 }}>→</span>
          <span style={{ color: C.aqua700 }}>STRUCTURING BOOK BY EMAIL</span>
        </div>
      </div>
    </div>
  );
}

// ── Right panel router ────────────────────────────────────────────────────────

function StructuringRight({ stage, setStage, intake, setIntake, briefId, setBriefId }) {
  if (stage === 'guided') return <ChatFlow intake={intake} onComplete={(id) => { setBriefId(id); setStage('done'); }} />;
  if (stage === 'done') return <Confirmation email={intake.email} briefId={briefId} />;
  return <AccessForm intake={intake} setIntake={setIntake} onSubmit={() => setStage('guided')} />;
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function AssetStructuringTool() {
  const [stage, setStage] = useState('form');
  const [briefId, setBriefId] = useState(null);
  const [intake, setIntake] = useState({
    name: '', company: '', email: '', phone: '',
    type: 'Real estate', value: '$1M – $10M',
    jurisdiction: '', description: '',
  });

  return (
    <section id="asset-structuring-tool" style={{ position: 'relative', background: C.paper, borderTop: `1px solid ${C.slate200}`, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(to right, rgba(10,25,32,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,25,32,0.04) 1px, transparent 1px)`, backgroundSize: '32px 32px', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'flex-end', marginBottom: 56 }}>
          <div>
            <Eyebrow coord="06 ·">ASSET STRUCTURING TOOL</Eyebrow>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.ink, margin: '20px 0 0', maxWidth: 720 }}>
              Start structuring your tokenized asset with Issatrix.
            </h2>
          </div>
          <p style={{ fontFamily: FONT_SANS, fontSize: 17, lineHeight: 1.65, color: C.slate500, margin: 0, maxWidth: 580 }}>
            Submit your asset details, then continue with the Issatrix Asset Structuring Tool through a guided chat experience. The tool helps collect the information needed to prepare an initial tokenization brief, which the Issatrix team reviews before sending the finalized Tokenization Structuring Book by email.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 56, alignItems: 'flex-start' }}>
          <StructuringExplainer />
          <StructuringRight stage={stage} setStage={setStage} intake={intake} setIntake={setIntake} briefId={briefId} setBriefId={setBriefId} />
        </div>
      </div>
    </section>
  );
}
