import React from 'react';
import { Link } from 'react-router-dom';
import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow, Btn } from '../../components/marketing/Primitives.jsx';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';
const HC = C;
const HF_DISPLAY = FONT_DISPLAY;
const HF_SANS = FONT_SANS;
const HF_MONO = FONT_MONO;

function HEyebrow({ coord, children, color }) {
  return <Eyebrow coord={coord} color={color}>{children}</Eyebrow>;
}

function HBtn({ variant, href, children }) {
  const map = { accent: 'accent', secondaryOnInk: 'secondary', secondary: 'secondary' };
  return <Btn variant={map[variant] || 'primary'} href={href}>{children}</Btn>;
}

function HSectionHeader({ coord, eyebrow, title, body }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'flex-end', marginBottom: 48 }}>
      <div>
        <Eyebrow coord={coord}>{eyebrow}</Eyebrow>
        <h2 style={{ fontFamily: HF_DISPLAY, fontWeight: 400, fontSize: 40, lineHeight: 1.1, letterSpacing: '-0.02em', color: HC.ink, margin: '20px 0 0' }}>{title}</h2>
      </div>
      {body && <p style={{ fontFamily: HF_SANS, fontSize: 17, lineHeight: 1.65, color: HC.slate500, margin: 0, maxWidth: 580 }}>{body}</p>}
    </div>
  );
}

function ProgramHero() {
  return (
    <section style={{ position: 'relative', background: HC.ink, color: HC.paper, overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.10 }} preserveAspectRatio="none" viewBox="0 0 1200 600">
        <line x1="0" y1="440" x2="1200" y2="440" stroke="#6BAAB2" strokeWidth="1.2" />
        <line x1="0" y1="448" x2="1200" y2="448" stroke="#6BAAB2" strokeWidth="0.6" opacity="0.5" />
        <g stroke="#6BAAB2" strokeWidth="1.5" fill="none">
          <path d="M 760 420 L 780 380 L 820 360 L 920 360 L 950 380 L 990 380 L 1020 410 L 1020 425 L 760 425 Z" />
          <circle cx="815" cy="425" r="20" />
          <circle cx="970" cy="425" r="20" />
        </g>
        <g stroke="#6BAAB2" strokeWidth="1" fill="none">
          <circle cx="160" cy="180" r="36" />
          <line x1="124" y1="180" x2="196" y2="180" />
          <line x1="160" y1="144" x2="160" y2="216" />
          <line x1="134" y1="154" x2="186" y2="206" />
          <line x1="186" y1="154" x2="134" y2="206" />
          <circle cx="380" cy="240" r="22" opacity="0.6" />
          <line x1="358" y1="240" x2="402" y2="240" opacity="0.6" />
          <line x1="380" y1="218" x2="380" y2="262" opacity="0.6" />
        </g>
      </svg>

      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <svg viewBox="0 0 320 40" width={120} height={15}>
              <text x="0" y="29" fill={HC.paper} fontFamily="'Geist', system-ui, sans-serif" fontWeight={500} fontSize={34} letterSpacing={6}>ISSATRIX</text>
            </svg>
          </Link>
          <span style={{ fontFamily: HF_MONO, color: 'rgba(245,242,235,0.4)' }}>×</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/hearstocks-mark.svg" style={{ width: 22, height: 22 }} alt="Hearstocks" />
            <span style={{ fontFamily: HF_SANS, fontSize: 16, fontWeight: 500, letterSpacing: '0.02em' }}>Hearstocks</span>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 20, fontFamily: HF_SANS, fontSize: 13 }}>
          <Link to="/#use-cases" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>← Use cases</Link>
          <Link to="/" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>Platform</Link>
          <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" style={{ color: HC.paper, textDecoration: 'none' }}>Get in touch</a>
        </nav>
      </div>

      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '64px 32px 80px' }}>
        <HEyebrow coord="▦ MX · 03" color={HC.aqua300}>USE CASE · COLLECTIBLES</HEyebrow>
        <h1 style={{ fontFamily: HF_DISPLAY, fontWeight: 400, fontSize: 'clamp(44px, 5.4vw, 72px)', lineHeight: 1.06, letterSpacing: '-0.02em', margin: '20px 0 0', color: HC.paper, maxWidth: 1040 }}>
          Fractional ownership infrastructure for high-value collectible cars.
        </h1>
        <p style={{ fontFamily: HF_SANS, fontSize: 20, lineHeight: 1.55, color: 'rgba(245,242,235,0.7)', marginTop: 24, maxWidth: 720 }}>
          Hearstocks tokenizes vintage and collectible cars through Issatrix infrastructure. High-value alternative assets are digitally represented, divided into ownership units, and made accessible through controlled investor onboarding and compliant lifecycle management.
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <HBtn variant="accent" href={CONTACT_URL}>Get in touch with the team →</HBtn>
          <Link to="/#use-cases" style={{ fontFamily: HF_SANS, fontWeight: 500, fontSize: 14, color: HC.paper, textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '0 18px', height: 40, border: `1px solid rgba(245,242,235,0.3)`, borderRadius: 4 }}>
            View asset catalogue
          </Link>
        </div>

        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid rgba(245,242,235,0.2)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[
            { v: '24',     l: 'VEHICLES UNDER MANAGEMENT' },
            { v: '$48.2M', l: 'CATALOGUE VALUE' },
            { v: '480',    l: 'OWNERSHIP CELLS / VEHICLE' },
            { v: 'BASE L2',l: 'PRIMARY CHAIN' },
            { v: 'REG A+', l: 'REGIME' },
          ].map((k, i) => (
            <div key={k.l} style={{ padding: i === 0 ? '0 16px 0 0' : '0 16px', borderLeft: i > 0 ? '1px solid rgba(245,242,235,0.18)' : 'none' }}>
              <div style={{ fontFamily: HF_DISPLAY, fontSize: 36, fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em' }}>{k.v}</div>
              <div style={{ fontFamily: HF_SANS, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 10, color: 'rgba(245,242,235,0.5)' }}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AssetOverview() {
  return (
    <section style={{ background: HC.paper, borderTop: `1px solid ${HC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <HSectionHeader
          coord="01 ·"
          eyebrow="ASSET OVERVIEW"
          title="What a tokenized collectible car can represent."
          body="Vintage cars are alternative assets with collector demand, limited supply, and unique valuation characteristics. Each vehicle becomes a digital ownership matrix where each cell represents one ownership unit."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: `1px solid ${HC.slate200}` }}>
          {[
            { coord: '01 · A', t: 'Verified asset',      b: 'Provenance, chassis, and condition independently authenticated.' },
            { coord: '01 · B', t: 'Custodied vehicle',   b: 'Climate-controlled storage with insurance and maintenance reporting.' },
            { coord: '01 · C', t: 'Fractional ownership',b: 'Each vehicle subdivided into discrete on-chain ownership units.' },
            { coord: '01 · D', t: 'Lifecycle data',      b: 'Valuation, restoration, transfers, and exit events on-chain.' },
          ].map((it, i) => (
            <div key={it.t} style={{ padding: '32px 24px 32px 0', borderRight: i < 3 ? `1px solid ${HC.slate200}` : 'none', paddingLeft: i === 0 ? 0 : 24 }}>
              <div style={{ fontFamily: HF_MONO, fontSize: 11, color: HC.slate400, letterSpacing: '0.06em' }}>{it.coord}</div>
              <h3 style={{ fontFamily: HF_DISPLAY, fontWeight: 400, fontSize: 24, lineHeight: 1.2, color: HC.ink, margin: '14px 0 10px' }}>{it.t}</h3>
              <p style={{ fontFamily: HF_SANS, fontSize: 14, lineHeight: 1.6, color: HC.slate500, margin: 0 }}>{it.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const challenges = [
    'Asset verification and provenance', 'Vehicle custody and storage',
    'Valuation and appraisal data', 'Investor eligibility and access',
    'Fractional ownership management', 'Secondary transfer rules',
    'Insurance and maintenance reporting', 'Exit, sale, or redemption logic',
  ];
  const vehicles = [
    { id: 'V01', name: '1963 ASTON · DB5',      val: '$3.6M', filled: 19, status: 'verified' },
    { id: 'V02', name: '1971 PORSCHE · 911 ST', val: '$2.1M', filled: 14, status: 'verified' },
    { id: 'V03', name: '1989 FERRARI · F40',    val: '$1.8M', filled: 9,  status: 'pending'  },
  ];
  const cells = 24;

  return (
    <section style={{ background: HC.bone, borderTop: `1px solid ${HC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <HSectionHeader
          coord="02 ·"
          eyebrow="THE CHALLENGE"
          title="Collectible assets don't fit standard issuance models."
          body="They require custody, authenticity, valuation, fractional ownership, transfer rules, insurance reporting, and an exit mechanism. Issatrix structures all of that in one platform."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'flex-start' }}>
          <div>
            <HEyebrow>WHAT THE INFRASTRUCTURE MUST HANDLE</HEyebrow>
            <div style={{ marginTop: 16, border: `1px solid ${HC.slate200}`, borderRadius: 2, fontFamily: HF_SANS, fontSize: 14, color: HC.ink }}>
              {challenges.map((ch, i) => (
                <div key={ch} style={{ padding: '14px 18px', borderBottom: i < challenges.length - 1 ? `1px solid ${HC.slate100}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: HF_MONO, fontSize: 11, color: HC.slate400, width: 28 }}>0{i + 1}</span>
                  <span>{ch}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40 }}>
              <HEyebrow color={HC.aqua700}>ISSATRIX SOLUTION</HEyebrow>
              <p style={{ fontFamily: HF_SANS, fontSize: 17, lineHeight: 1.6, color: HC.slate500, marginTop: 12, maxWidth: 480 }}>
                Issatrix issues and manages fractional digital ownership units per vehicle, with investor onboarding, transfer controls, asset documentation, valuation updates, and lifecycle events such as sale, buyback, or distribution.
              </p>
            </div>
          </div>
          <div>
            <div style={{ border: `1px solid ${HC.slate200}`, background: HC.paper2, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontFamily: HF_MONO, fontSize: 10, color: HC.slate400, letterSpacing: '0.08em' }}>
                <span>HEARSTOCKS · CATALOGUE</span><span>3 OF 24 VEHICLES · {cells} OWNERSHIP CELLS EACH</span>
              </div>
              {vehicles.map((v) => (
                <div key={v.id} style={{ padding: '14px 0', borderTop: `1px solid ${HC.slate200}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontFamily: HF_MONO, fontSize: 10, color: HC.slate400, letterSpacing: '0.08em' }}>{v.id}</span>
                      <span style={{ fontFamily: HF_SANS, fontWeight: 500, fontSize: 14, color: HC.ink, marginLeft: 10 }}>{v.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: HF_MONO, fontSize: 10, padding: '2px 8px', borderRadius: 999, background: v.status === 'pending' ? '#F5ECDC' : '#E6F0E9', color: v.status === 'pending' ? HC.pending : HC.verified, letterSpacing: '0.04em' }}>
                        {v.status === 'pending' ? '◐ APPRAISAL' : '● VERIFIED'}
                      </span>
                      <span style={{ fontFamily: HF_MONO, fontSize: 12, color: HC.ink, fontVariantNumeric: 'tabular-nums' }}>{v.val}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cells}, 1fr)`, gap: 3 }}>
                    {Array.from({ length: cells }).map((_, i) => {
                      const filled = i < v.filled;
                      const featured = (i === 2 || i === 8 || i === 14);
                      const bg = !filled ? 'transparent' : featured ? HC.aqua600 : HC.ink;
                      return <div key={i} style={{ aspectRatio: '1 / 1', background: bg, border: !filled ? `1px dashed ${HC.slate300}` : 'none' }} />;
                    })}
                  </div>
                  <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', fontFamily: HF_MONO, fontSize: 10, color: HC.slate500, letterSpacing: '0.06em' }}>
                    <span>SOLD {v.filled} / {cells}</span>
                    <span>OPEN {cells - v.filled}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LifecycleFlow() {
  const stages = [
    { n: '01', t: 'Verification',    d: 'Provenance, chassis, and condition independently authenticated.' },
    { n: '02', t: 'Custody & docs',  d: 'Climate-controlled storage; documentation registered on-chain.' },
    { n: '03', t: 'Token issuance',  d: 'Programmatic minting of fractional ownership units per vehicle.' },
    { n: '04', t: 'Investor access', d: 'Allowlisted onboarding; jurisdictional eligibility checks.' },
    { n: '05', t: 'Transfers',       d: 'Controlled secondary transfers between allowlisted holders.' },
    { n: '06', t: 'Valuation',       d: 'Periodic appraisals attested and pushed to the on-chain registry.' },
    { n: '07', t: 'Exit / settlement', d: 'Sale, buyback, or distribution events settled to all holders.' },
  ];
  return (
    <section style={{ background: HC.paper, borderTop: `1px solid ${HC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <HSectionHeader
          coord="03 ·"
          eyebrow="LIFECYCLE FLOW"
          title="From verification to exit, on one set of rails."
          body="Every collectible program on Issatrix moves through the same lifecycle stages. Hearstocks adds a verification and custody-documentation phase before issuance."
        />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          <div style={{ position: 'absolute', left: '3%', right: '3%', top: 15, height: 1, background: HC.slate200, zIndex: 0 }} />
          {stages.map(s => (
            <div key={s.n} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 999, background: HC.bone, border: `1px solid ${HC.slate300}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HF_MONO, fontSize: 11, color: HC.ink, zIndex: 1 }}>{s.n}</div>
              <div style={{ fontFamily: HF_SANS, fontWeight: 500, fontSize: 14, color: HC.ink }}>{s.t}</div>
              <div style={{ fontFamily: HF_SANS, fontSize: 13, lineHeight: 1.55, color: HC.slate500 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Modules() {
  const modules = [
    { t: 'Token issuance engine',      d: 'Programmable fractional minting per verified vehicle.' },
    { t: 'Investor dashboard',         d: 'Holdings, valuation, distributions, lifecycle events.' },
    { t: 'Issuer dashboard',           d: 'Treasury, compliance, and catalogue management.' },
    { t: 'KYC / AML',                  d: 'Identity, accreditation, and source-of-funds checks.' },
    { t: 'Wallet whitelisting',        d: 'Allowlist-based access on every supported chain.' },
    { t: 'Transfer controls',          d: 'Secondary transfer rules and lockup enforcement.' },
    { t: 'Asset documentation',        d: 'Provenance, condition, insurance, and audit registry.' },
    { t: 'Reporting dashboard',        d: 'Valuation, maintenance, and lifecycle event feed.' },
    { t: 'Secondary-market readiness', d: 'Order books and structured liquidity hooks.' },
  ];
  return (
    <section style={{ background: HC.bone, borderTop: `1px solid ${HC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <HSectionHeader
          coord="04 ·"
          eyebrow="PLATFORM MODULES"
          title="The Issatrix modules used in Hearstocks."
          body="Hearstocks runs on a defined subset of the Issatrix platform. Each module is reusable across other use cases."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: `1px solid ${HC.slate200}` }}>
          {modules.map((m, i) => (
            <div key={m.t} style={{ padding: '20px 18px', borderRight: (i + 1) % 3 !== 0 ? `1px solid ${HC.slate200}` : 'none', borderBottom: i < modules.length - 3 ? `1px solid ${HC.slate200}` : 'none' }}>
              <div style={{ fontFamily: HF_MONO, fontSize: 10, color: HC.slate400, letterSpacing: '0.08em' }}>{(i + 1).toString().padStart(2, '0')}</div>
              <h4 style={{ fontFamily: HF_SANS, fontWeight: 500, fontSize: 16, color: HC.ink, margin: '8px 0 6px' }}>{m.t}</h4>
              <p style={{ fontFamily: HF_SANS, fontSize: 13, lineHeight: 1.55, color: HC.slate500, margin: 0 }}>{m.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section style={{ background: HC.ink, color: HC.paper, borderTop: '1px solid rgba(245,242,235,0.1)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <HEyebrow color={HC.aqua300} coord="05 ·">GET IN TOUCH</HEyebrow>
            <h2 style={{ fontFamily: HF_DISPLAY, fontWeight: 400, fontSize: 48, lineHeight: 1.08, letterSpacing: '-0.02em', color: HC.paper, margin: '20px 0 16px' }}>
              Explore how Issatrix supports collectible asset tokenization.
            </h2>
            <p style={{ fontFamily: HF_SANS, fontSize: 17, lineHeight: 1.6, color: 'rgba(245,242,235,0.7)', margin: 0, maxWidth: 580 }}>
              Speak with the Hearstocks team about applying the Issatrix issuance matrix to vintage cars and other high-value collectibles.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <HBtn variant="accent" href={CONTACT_URL}>Get in touch with the team →</HBtn>
              <Link to="/" style={{ fontFamily: HF_SANS, fontWeight: 500, fontSize: 14, color: HC.paper, textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '0 18px', height: 40, border: `1px solid rgba(245,242,235,0.3)`, borderRadius: 4 }}>
                Back to Issatrix
              </Link>
            </div>
          </div>
          <div>
            <div style={{ border: '1px solid rgba(245,242,235,0.2)', padding: 24, fontFamily: HF_MONO, fontSize: 12, color: 'rgba(245,242,235,0.7)', letterSpacing: '0.04em' }}>
              <div style={{ fontFamily: HF_SANS, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(245,242,235,0.5)', marginBottom: 16 }}>▦ MX · 03 · HEARSTOCKS</div>
              {[['ASSET', 'Vintage cars · collectibles'], ['REGIME', 'Reg A+ · 506(c)'], ['CHAINS', 'Base L2 · Ethereum L1'], ['STATUS', '24 vehicles under management'], ['MATRIX', '480 ownership cells / vehicle']].map(([k, v], i, a) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: i < a.length - 1 ? '1px solid rgba(245,242,235,0.1)' : 'none' }}>
                  <span style={{ color: 'rgba(245,242,235,0.5)' }}>{k}</span>
                  <span style={{ color: HC.paper, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid rgba(245,242,235,0.18)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontFamily: HF_MONO, fontSize: 11, color: 'rgba(245,242,235,0.5)', letterSpacing: '0.04em' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link to="/#use-cases" style={{ color: HC.paper, textDecoration: 'none' }}>← ALL USE CASES</Link>
            <Link to="/" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>PLATFORM</Link>
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>GET IN TOUCH</a>
          </div>
          <span>© 2026 ISSATRIX · INFRASTRUCTURE FOR ISSUANCE</span>
        </div>
      </div>
    </section>
  );
}

export default function HearstocksPage() {
  return (
    <>
      <ProgramHero />
      <AssetOverview />
      <Solution />
      <LifecycleFlow />
      <Modules />
      <CTA />
    </>
  );
}
