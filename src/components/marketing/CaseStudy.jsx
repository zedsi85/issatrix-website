import { useState } from 'react';
import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow } from './Primitives.jsx';

function UseCaseCard({ uc, idx }) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={uc.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        textDecoration: 'none', color: 'inherit',
        background: C.bone,
        border: `1px solid ${hover ? C.ink : C.slate200}`,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'border-color 160ms cubic-bezier(0.2,0,0,1), transform 320ms cubic-bezier(0.2,0,0,1), box-shadow 320ms cubic-bezier(0.2,0,0,1)',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hover ? '0 16px 36px rgba(10,25,32,0.10)' : '0 0 0 transparent',
      }}
    >
      <div style={{ position: 'relative', background: C.ink, height: 188, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(245,242,235,0.07) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(245,242,235,0.07) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />
        <div style={{ position: 'absolute', top: 16, left: 16, fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(245,242,235,0.55)', letterSpacing: '0.1em' }}>
          ▦ MX · 0{idx + 1}
        </div>
        <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(245,242,235,0.55)', letterSpacing: '0.1em' }}>
          {uc.regime}
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={uc.mark} alt="" style={{ width: 88, height: 88, borderRadius: 2 }} />
        </div>
        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(245,242,235,0.7)', letterSpacing: '0.1em' }}>
            {uc.category.toUpperCase()}
          </span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(245,242,235,0.5)', letterSpacing: '0.06em' }}>
            {uc.kpi}
          </span>
        </div>
      </div>

      <div style={{ padding: '24px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 32, lineHeight: 1.05, letterSpacing: '-0.02em', color: C.ink, margin: 0 }}>
          {uc.name}
        </h3>
        <div style={{ fontFamily: FONT_SANS, fontSize: 13, color: C.slate500, marginTop: 6 }}>{uc.subtitle}</div>
        <p style={{ fontFamily: FONT_SANS, fontSize: 14, lineHeight: 1.6, color: C.slate500, margin: '16px 0 0' }}>{uc.body}</p>
        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {uc.tags.map(t => (
            <span key={t} style={{
              display: 'inline-flex', alignItems: 'center',
              height: 24, padding: '0 9px', borderRadius: 2,
              border: `1px solid ${C.slate200}`,
              fontFamily: FONT_SANS, fontSize: 11, color: C.slate500, whiteSpace: 'nowrap',
            }}>{t}</span>
          ))}
        </div>
        <div style={{
          marginTop: 24, paddingTop: 16, borderTop: `1px solid ${C.slate100}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: FONT_SANS, fontWeight: 500, fontSize: 13,
          color: hover ? C.ink : C.aqua700,
          transition: 'color 160ms cubic-bezier(0.2,0,0,1)',
        }}>
          <span>View {uc.name} use case</span>
          <span style={{ transition: 'transform 200ms cubic-bezier(0.2,0,0,1)', transform: hover ? 'translateX(3px)' : 'translateX(0)' }}>→</span>
        </div>
      </div>
    </a>
  );
}

const usecases = [
  {
    name: 'AquaIndex',
    subtitle: 'Water reserves tokenization',
    category: 'Water reserves',
    mark: '/assets/aquaindex-mark.svg',
    regime: 'REG D 506(c)',
    kpi: 'ETH L1 · 12.48M UNITS',
    body: 'Real water reserves represented digitally and made accessible through a structured tokenization platform built on Issatrix infrastructure.',
    tags: ['Water assets', 'Redemption workflows', 'Asset-backed issuance', 'Investor access'],
    href: '/use-cases/aquaindex',
  },
  {
    name: 'SABREX',
    subtitle: 'Underwater minerals & mining tokenization',
    category: 'Underwater minerals',
    mark: '/assets/sabrex-mark.svg',
    regime: 'GOV · KSA',
    kpi: 'MULTI-CHAIN · GOV-BACKED',
    body: 'A tokenization framework for underwater mineral mining assets, designed for large-scale resource projects and government-backed natural resource infrastructure.',
    tags: ['Underwater minerals', 'Mining assets', 'Government-backed', 'Natural resources'],
    href: '/use-cases/sabrex',
  },
  {
    name: 'Hearstocks',
    subtitle: 'Vintage cars tokenization',
    category: 'Collectibles',
    mark: '/assets/hearstocks-mark.svg',
    regime: 'REG A+ · 506(c)',
    kpi: 'BASE L2 · FRACTIONAL',
    body: 'A tokenization platform for fractional ownership and digital representation of high-value vintage and collectible cars.',
    tags: ['Vintage cars', 'Collectibles', 'Fractional ownership', 'Alternative assets'],
    href: '/use-cases/hearstocks',
  },
];

export default function CaseStudy() {
  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'flex-end', marginBottom: 56 }}>
          <div>
            <Eyebrow coord="04 ·">USE CASES</Eyebrow>
            <h2 style={{
              fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 44, lineHeight: 1.1,
              letterSpacing: '-0.02em', color: C.ink, margin: '20px 0 0',
            }}>
              Different assets. Same issuance matrix.
            </h2>
          </div>
          <p style={{ fontFamily: FONT_SANS, fontSize: 17, lineHeight: 1.65, color: C.slate500, margin: 0, maxWidth: 580 }}>
            Issatrix powers tokenization platforms across multiple real-world asset categories. Each asset is structured into programmable ownership units with dedicated compliance, investor access, lifecycle, and reporting logic.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }}>
          {usecases.map((uc, i) => (
            <UseCaseCard key={uc.name} uc={uc} idx={i} />
          ))}
        </div>

        <div style={{
          marginTop: 40, paddingTop: 20, borderTop: `1px solid ${C.slate200}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap',
        }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, letterSpacing: '0.06em' }}>
            3 LIVE PROGRAMS · MORE IN PIPELINE
          </span>
          <a href="/use-cases/aquaindex" style={{
            fontFamily: FONT_SANS, fontWeight: 500, fontSize: 14, color: C.ink,
            textDecoration: 'underline', textUnderlineOffset: 4,
          }}>
            All use cases →
          </a>
        </div>
      </div>
    </section>
  );
}
