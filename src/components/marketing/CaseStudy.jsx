import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow, Btn, Badge } from './Primitives.jsx';
import aquaindexMark from '/assets/aquaindex-mark.svg';

const STATS = [
  { v: '$420.0M', l: 'NOTIONAL' },
  { v: '12.48M',  l: 'SUPPLY' },
  { v: '1,284',   l: 'HOLDERS' },
  { v: '4.8 yr',  l: 'AVG TENURE' },
];

export default function CaseStudy() {
  const bars = Array.from({ length: 24 }).map((_, i) => ({
    h: 8 + Math.round(20 * Math.abs(Math.sin(i * 0.6))),
    recent: i > 18,
  }));

  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 64, alignItems: 'flex-start' }}>
          <div>
            <Eyebrow coord="04 ·">FIRST MAJOR USE CASE</Eyebrow>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 44,
              lineHeight: 1.1, letterSpacing: '-0.02em', color: C.ink,
              margin: '20px 0 16px',
            }}>AquaIndex</h2>
            <p style={{ fontFamily: FONT_SANS, fontSize: 15, lineHeight: 1.6, color: C.slate500, margin: 0 }}>
              Real water reserves represented digitally and made accessible through a structured tokenization platform built on Issatrix infrastructure.
            </p>
            <div style={{ marginTop: 24 }}>
              <Btn variant="secondary">Read the AquaIndex brief →</Btn>
            </div>
          </div>

          <div style={{
            border: `1px solid ${C.slate200}`, borderRadius: 2,
            background: C.bone, padding: 32,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={aquaindexMark} style={{ width: 32, height: 32, borderRadius: 2 }} alt="AquaIndex" />
                  <div style={{ fontFamily: FONT_SANS, fontSize: 13, color: C.slate400, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    AquaIndex · Series A
                  </div>
                </div>
                <h3 style={{
                  fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 32,
                  lineHeight: 1.1, letterSpacing: '-0.02em', color: C.ink,
                  margin: '14px 0 8px',
                }}>Water reserve, Aragón basin</h3>
                <p style={{ fontFamily: FONT_SANS, fontSize: 13, color: C.slate500, margin: 0 }}>
                  Reg D 506(c) · Accredited only · Quarterly redemption · Ethereum L1 + Base L2
                </p>
              </div>
              <Badge tone="verified">VERIFIED</Badge>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              borderTop: `1px solid ${C.slate200}`, marginTop: 24, paddingTop: 18,
            }}>
              {STATS.map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontVariantNumeric: 'tabular-nums', color: C.ink }}>{s.v}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, marginTop: 4, letterSpacing: '0.08em' }}>{s.l}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: 2 }}>
              {bars.map((b, i) => (
                <div key={i} style={{ height: b.h, background: b.recent ? C.aqua600 : C.ink, alignSelf: 'end' }} />
              ))}
            </div>
            <div style={{ marginTop: 8, fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, display: 'flex', justifyContent: 'space-between' }}>
              <span>JAN</span><span>JUN</span><span>DEC</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
