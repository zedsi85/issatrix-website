import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow } from './Primitives.jsx';

const ITEMS = [
  {
    coord: '03 · A', title: 'Issuance',
    body: 'Structure tokens with explicit lifecycle stages. Define supply, vesting, transfer controls, and redemption windows before launch.',
    bullets: ['Multi-chain deployment', 'Programmable supply', 'Lifecycle stages on-chain'],
  },
  {
    coord: '03 · B', title: 'Investor onboarding',
    body: 'Bring qualified investors onto the matrix with built-in compliance. KYC, accreditation, and jurisdiction-aware allowlists.',
    bullets: ['KYC / KYB hooks', 'Accreditation gating', 'Jurisdictional rules engine'],
  },
  {
    coord: '03 · C', title: 'Transfer & redemption',
    body: 'Control who can hold, who can transfer, and how investors exit. Redemption queues, secondary-market readiness, audit trail.',
    bullets: ['Transfer-controlled tokens', 'Quarterly redemption queues', 'Audit-grade event log'],
  },
];

export default function Pillars() {
  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <Eyebrow coord="03 ·">PLATFORM CAPABILITIES</Eyebrow>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 44,
          lineHeight: 1.1, letterSpacing: '-0.02em', color: C.ink,
          margin: '20px 0 64px', maxWidth: 720,
        }}>
          The full issuance lifecycle, on one set of rails.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: `1px solid ${C.slate200}` }}>
          {ITEMS.map((it, i) => (
            <div key={it.title} style={{
              padding: '32px 24px 32px 0',
              borderRight: i < 2 ? `1px solid ${C.slate200}` : 'none',
              paddingLeft: i === 0 ? 0 : 24,
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, letterSpacing: '0.06em' }}>{it.coord}</div>
              <h3 style={{
                fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 28,
                lineHeight: 1.2, color: C.ink, margin: '14px 0 12px',
              }}>{it.title}</h3>
              <p style={{ fontFamily: FONT_SANS, fontSize: 15, lineHeight: 1.6, color: C.slate500, margin: 0 }}>{it.body}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {it.bullets.map(b => (
                  <li key={b} style={{ fontFamily: FONT_SANS, fontSize: 13, color: C.ink, display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ color: C.aqua600, fontFamily: FONT_MONO }}>▮</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
