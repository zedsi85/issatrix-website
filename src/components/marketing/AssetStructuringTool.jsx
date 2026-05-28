import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow } from './Primitives.jsx';

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

// ── CTA card ──────────────────────────────────────────────────────────────────

function StructuringCTA({ onOpenPanel }) {
  return (
    <div style={{ background: C.ink, borderRadius: 2, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 320, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(to right, rgba(245,242,235,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,242,235,0.05) 1px, transparent 1px)`, backgroundSize: '24px 24px', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <Eyebrow coord="▦" color="rgba(245,242,235,0.5)">READY TO START</Eyebrow>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 30, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.paper, margin: '16px 0 14px' }}>
          Structure your asset with Issatrix.
        </h3>
        <p style={{ fontFamily: FONT_SANS, fontSize: 15, lineHeight: 1.6, color: 'rgba(245,242,235,0.68)', margin: '0 0 28px', maxWidth: 400 }}>
          The Pre-Structuring Tool collects your asset details through a guided conversation, then generates a tokenization brief reviewed by the Issatrix team.
        </p>
        <button
          onClick={onOpenPanel}
          style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 14, height: 42, padding: '0 20px', borderRadius: 4, background: C.paper, color: C.ink, border: '1px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'opacity 120ms' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Access Pre-Structuring Tool →
        </button>
      </div>
      <div style={{ position: 'relative', marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(245,242,235,0.14)', display: 'flex', gap: 24, fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(245,242,235,0.45)', letterSpacing: '0.06em', flexWrap: 'wrap' }}>
        <span>● CONFIDENTIAL</span>
        <span>▸ GUIDED CHAT</span>
        <span>▦ BRIEF GENERATED</span>
        <span>✉ BOOK BY EMAIL</span>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function AssetStructuringTool({ onOpenPanel }) {
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
          <StructuringCTA onOpenPanel={onOpenPanel} />
        </div>
      </div>
    </section>
  );
}
