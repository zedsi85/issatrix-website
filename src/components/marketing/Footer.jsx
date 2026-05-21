import { C, FONT_SANS, FONT_MONO } from './Primitives.jsx';

const COLS = [
  { h: 'PLATFORM',       items: ['Issuance', 'Onboarding', 'Transfer control', 'Redemption', 'Audit log'] },
  { h: 'INFRASTRUCTURE', items: ['Architecture', 'Chains supported', 'SDKs', 'Status', 'Security'] },
  { h: 'PROGRAMS',       items: ['AquaIndex', 'Methodology', 'Case studies', 'Partners', 'Become an issuer'] },
  { h: 'COMPANY',        items: ['About', 'Compliance', 'Press', 'Contact', 'Legal'] },
];

export default function Footer() {
  return (
    <footer style={{ background: C.ink, color: C.paper }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <svg viewBox="0 0 320 40" width={200} height={25}>
              <text x="0" y="29" fill={C.paper}
                fontFamily="'Geist', system-ui, sans-serif" fontWeight={500}
                fontSize={34} letterSpacing={6}>ISSATRIX</text>
            </svg>
            <p style={{ fontFamily: FONT_SANS, fontSize: 14, lineHeight: 1.6, color: 'rgba(245,242,235,0.7)', maxWidth: 320, marginTop: 18 }}>
              The issuance matrix. Infrastructure for the next generation of asset issuance.
            </p>
            <div style={{ marginTop: 24, fontFamily: FONT_MONO, fontSize: 11, color: 'rgba(245,242,235,0.5)' }}>
              ▦ &nbsp; ISSUANCE + MATRIX
            </div>
          </div>
          {COLS.map(c => (
            <div key={c.h}>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(245,242,235,0.5)' }}>{c.h}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {c.items.map(it => (
                  <li key={it} style={{ fontFamily: FONT_SANS, fontSize: 14, color: C.paper }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 64, paddingTop: 24,
          borderTop: '1px solid rgba(245,242,235,0.18)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 24, flexWrap: 'wrap',
          fontFamily: FONT_MONO, fontSize: 11, color: 'rgba(245,242,235,0.5)', letterSpacing: '0.04em',
        }}>
          <span>© 2026 ISSATRIX · INSTITUTIONAL-GRADE TOKENIZATION INFRASTRUCTURE</span>
          <span>v3.2 · BUILT FOR ISSUERS</span>
        </div>
      </div>
    </footer>
  );
}
