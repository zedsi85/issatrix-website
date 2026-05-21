import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow, Btn, MatrixBg } from './Primitives.jsx';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';

export function PageHero({ coord, eyebrow, title, body, primaryCta, secondaryCta }) {
  return (
    <section style={{ position: 'relative', background: C.paper, overflow: 'hidden' }}>
      <MatrixBg opacity={0.05} cell={32} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '96px 32px 64px' }}>
        <Eyebrow coord={coord}>{eyebrow}</Eyebrow>
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 'clamp(44px, 5vw, 72px)',
          lineHeight: 1.06, letterSpacing: '-0.02em', color: C.ink,
          margin: '24px 0 0', maxWidth: 1000,
        }}>{title}</h1>
        <p style={{
          fontFamily: FONT_SANS, fontWeight: 400, fontSize: 20, lineHeight: 1.55,
          color: C.slate500, marginTop: 24, maxWidth: 660,
        }}>{body}</p>
        {(primaryCta || secondaryCta) && (
          <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            {primaryCta && <Btn variant="primary" href={primaryCta.href}>{primaryCta.label}</Btn>}
            {secondaryCta && <Btn variant="ghost" href={secondaryCta.href}>{secondaryCta.label}</Btn>}
          </div>
        )}
      </div>
    </section>
  );
}

export function PageSectionHeader({ coord, eyebrow, title, body }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'flex-end', marginBottom: 48 }}>
      <div>
        <Eyebrow coord={coord}>{eyebrow}</Eyebrow>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 40, lineHeight: 1.1,
          letterSpacing: '-0.02em', color: C.ink, margin: '20px 0 0',
        }}>{title}</h2>
      </div>
      {body && (
        <p style={{ fontFamily: FONT_SANS, fontSize: 17, lineHeight: 1.65, color: C.slate500, margin: 0, maxWidth: 580 }}>
          {body}
        </p>
      )}
    </div>
  );
}

export function HairlineGrid({ items, columns = 4, background }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 0,
      borderTop: `1px solid ${C.slate200}`,
      background: background || 'transparent',
    }}>
      {items.map((it, i) => (
        <div key={it.title || it.t || i} style={{
          padding: '32px 24px 32px 0',
          borderRight: (i + 1) % columns !== 0 ? `1px solid ${C.slate200}` : 'none',
          borderBottom: i < items.length - columns ? `1px solid ${C.slate200}` : 'none',
          paddingLeft: i % columns === 0 ? 0 : 24,
        }}>
          {it.coord && <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, letterSpacing: '0.06em' }}>{it.coord}</div>}
          <h3 style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 22, lineHeight: 1.2,
            color: C.ink, margin: it.coord ? '12px 0 10px' : '0 0 10px',
          }}>{it.title || it.t}</h3>
          <p style={{ fontFamily: FONT_SANS, fontSize: 14, lineHeight: 1.6, color: C.slate500, margin: 0 }}>
            {it.body || it.b}
          </p>
        </div>
      ))}
    </div>
  );
}

export function PageCTA({ eyebrow = 'GET IN TOUCH', title, body }) {
  return (
    <section style={{ background: C.ink, color: C.paper }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <Eyebrow coord="◉" color={C.aqua300}>{eyebrow}</Eyebrow>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 48, lineHeight: 1.08,
          letterSpacing: '-0.02em', color: C.paper, margin: '20px 0 16px', maxWidth: 720,
        }}>{title}</h2>
        <p style={{
          fontFamily: FONT_SANS, fontSize: 17, lineHeight: 1.6,
          color: 'rgba(245,242,235,0.7)', margin: 0, maxWidth: 580,
        }}>{body}</p>
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Btn variant="accent" href={CONTACT_URL}>Get in touch with the team →</Btn>
          <Btn variant="secondary" href="/">
            <span style={{ color: C.paper }}>Back to Issatrix</span>
          </Btn>
        </div>

        <div style={{
          marginTop: 64, paddingTop: 24, borderTop: '1px solid rgba(245,242,235,0.18)',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          fontFamily: FONT_MONO, fontSize: 11, color: 'rgba(245,242,235,0.5)', letterSpacing: '0.04em',
        }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <a href="/" style={{ color: C.paper, textDecoration: 'none' }}>← PLATFORM</a>
            <a href="/issuance" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>ISSUANCE</a>
            <a href="/compliance" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>COMPLIANCE</a>
            <a href="/docs" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>DOCS</a>
          </div>
          <span>© 2026 ISSATRIX · INFRASTRUCTURE FOR ISSUANCE</span>
        </div>
      </div>
    </section>
  );
}
