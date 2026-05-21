import { C, FONT_DISPLAY, FONT_SANS } from './Primitives.jsx';

const DATA = [
  { v: '$2.4B',  l: 'Notional issued' },
  { v: '14,082', l: 'Holders onboarded' },
  { v: '38',     l: 'Issuance programs' },
  { v: '99.97%', l: 'Settlement integrity' },
];

export default function Stats() {
  return (
    <section style={{ background: C.ink, color: C.paper }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid rgba(245,242,235,0.18)',
        }}>
          {DATA.map((d, i) => (
            <div key={d.l} style={{
              padding: '32px 24px 0',
              paddingLeft: i === 0 ? 0 : 24,
              borderLeft: i > 0 ? '1px solid rgba(245,242,235,0.18)' : 'none',
            }}>
              <div style={{
                fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 56,
                fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em',
              }}>{d.v}</div>
              <div style={{
                fontFamily: FONT_SANS, fontWeight: 500, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: '0.14em',
                marginTop: 14, color: 'rgba(245,242,235,0.6)',
              }}>{d.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
