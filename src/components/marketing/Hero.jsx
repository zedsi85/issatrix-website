import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow, Btn } from './Primitives.jsx';
import HeroMatrix from './HeroMatrix.jsx';

const TOKENS = [
  'AQX-A · 0x7a3c…ae04',
  'SYN-22 · 0x9F2c…1102',
  'GLD-04 · 0x412e…9bb8',
  'AQX-B · 0x88c1…0f44',
  'REA-11 · 0xa01f…7732',
  'CCX-02 · 0x55de…3a18',
];

export default function Hero({ cellSize = 36, density = 16, intensity = 0 }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: C.paper, minHeight: 620 }}>
      <HeroMatrix cell={cellSize} density={density} intensity={intensity} />

      <div style={{
        position: 'relative', maxWidth: 1240, margin: '0 auto',
        padding: '96px 32px 64px',
        pointerEvents: 'none',
      }}>
        <div style={{ pointerEvents: 'auto', display: 'inline-block' }}>
          <Eyebrow coord="▦ 01">THE ISSUANCE MATRIX</Eyebrow>
        </div>

        <h1 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400,
          fontSize: 'clamp(48px, 6vw, 84px)',
          lineHeight: 1.08, letterSpacing: '-0.02em',
          color: C.ink, margin: '24px 0 0', maxWidth: 920,
        }}>
          Infrastructure for compliant real-world asset issuance.
        </h1>

        <p style={{
          fontFamily: FONT_SANS, fontWeight: 400, fontSize: 20,
          lineHeight: 1.5, color: C.slate500, marginTop: 24, maxWidth: 620,
        }}>
          Issatrix is the issuance matrix. Issue, manage, and redeem tokenized real-world assets through structured lifecycle infrastructure — across multiple blockchain ecosystems, under institutional controls.
        </p>

        <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center', pointerEvents: 'auto' }}>
          <Btn variant="primary" href="#asset-structuring-tool">Request access →</Btn>
          <Btn variant="ghost">Read the architecture brief</Btn>
        </div>

        <div style={{
          marginTop: 80, paddingTop: 18,
          borderTop: `1px solid ${C.slate200}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          gap: 24, flexWrap: 'wrap', pointerEvents: 'auto',
          background: 'rgba(245, 242, 235, 0.7)', backdropFilter: 'blur(2px)',
        }}>
          <Eyebrow coord="● LIVE">ISSUANCE LEDGER · LAST 24H · HOVER THE GRID</Eyebrow>
          <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: C.slate500, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {TOKENS.map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
