import React from 'react';
import { Link } from 'react-router-dom';
import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow, Btn } from '../../components/marketing/Primitives.jsx';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';
const SC = C;
const SF_DISPLAY = FONT_DISPLAY;
const SF_SANS = FONT_SANS;
const SF_MONO = FONT_MONO;

function SEyebrow({ coord, children, color }) {
  return <Eyebrow coord={coord} color={color}>{children}</Eyebrow>;
}

function SBtn({ variant, href, children }) {
  const map = { accent: 'accent', secondaryOnInk: 'secondary', secondary: 'secondary' };
  return <Btn variant={map[variant] || 'primary'} href={href}>{children}</Btn>;
}

function SectionHeader({ coord, eyebrow, title, body }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'flex-end', marginBottom: 48 }}>
      <div>
        <Eyebrow coord={coord}>{eyebrow}</Eyebrow>
        <h2 style={{ fontFamily: SF_DISPLAY, fontWeight: 400, fontSize: 40, lineHeight: 1.1, letterSpacing: '-0.02em', color: SC.ink, margin: '20px 0 0' }}>{title}</h2>
      </div>
      {body && <p style={{ fontFamily: SF_SANS, fontSize: 17, lineHeight: 1.65, color: SC.slate500, margin: 0, maxWidth: 580 }}>{body}</p>}
    </div>
  );
}

function ProgramHero() {
  return (
    <section style={{ position: 'relative', background: SC.ink, color: SC.paper, overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.10 }} preserveAspectRatio="none" viewBox="0 0 1200 600">
        <path d="M0 80 Q 150 60 300 80 T 600 80 T 900 80 T 1200 80" stroke="#6BAAB2" strokeWidth="1.2" fill="none" />
        {[140, 200, 280, 380, 480].map((y, i) => (
          <line key={i} x1="0" y1={y} x2="1200" y2={y} stroke="#6BAAB2" strokeWidth="1" opacity={0.6 - i * 0.1} />
        ))}
        <g stroke="#6BAAB2" strokeWidth="1.2" fill="none">
          <polygon points="120,320 180,290 240,320 180,360" />
          <polygon points="380,420 440,390 500,420 440,460" />
          <polygon points="780,360 840,330 900,360 840,400" />
          <polygon points="1020,440 1080,410 1140,440 1080,480" />
        </g>
      </svg>

      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <svg viewBox="0 0 320 40" width={120} height={15}>
              <text x="0" y="29" fill={SC.paper} fontFamily="'Geist', system-ui, sans-serif" fontWeight={500} fontSize={34} letterSpacing={6}>ISSATRIX</text>
            </svg>
          </Link>
          <span style={{ fontFamily: SF_MONO, color: 'rgba(245,242,235,0.4)' }}>×</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/sabrex-mark.svg" style={{ width: 22, height: 22 }} alt="SABREX" />
            <span style={{ fontFamily: SF_SANS, fontSize: 16, fontWeight: 500, letterSpacing: '0.04em' }}>SABREX</span>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 20, fontFamily: SF_SANS, fontSize: 13 }}>
          <Link to="/#use-cases" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>← Use cases</Link>
          <Link to="/" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>Platform</Link>
          <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" style={{ color: SC.paper, textDecoration: 'none' }}>Get in touch</a>
        </nav>
      </div>

      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '64px 32px 80px' }}>
        <SEyebrow coord="▦ MX · 02" color={SC.aqua300}>USE CASE · UNDERWATER MINERALS</SEyebrow>
        <h1 style={{ fontFamily: SF_DISPLAY, fontWeight: 400, fontSize: 'clamp(44px, 5.4vw, 72px)', lineHeight: 1.06, letterSpacing: '-0.02em', margin: '20px 0 0', color: SC.paper, maxWidth: 1040 }}>
          Tokenizing underwater mineral resources through structured issuance infrastructure.
        </h1>
        <p style={{ fontFamily: SF_SANS, fontSize: 20, lineHeight: 1.55, color: 'rgba(245,242,235,0.7)', marginTop: 24, maxWidth: 720 }}>
          SABREX applies Issatrix infrastructure to underwater minerals and mining assets. The model is designed for large-scale natural-resource projects where ownership, production rights, investor access, compliance, and asset-lifecycle data need to be structured in a digital issuance system.
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <SBtn variant="accent" href={CONTACT_URL}>Get in touch with the team →</SBtn>
          <SBtn variant="secondaryOnInk" href="/docs"><span style={{ color: SC.paper }}>Read the framework brief</span></SBtn>
        </div>

        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid rgba(245,242,235,0.2)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[
            { v: 'KSA',   l: 'JURISDICTION' },
            { v: '12',    l: 'EXTRACTION BLOCKS' },
            { v: 'GOV',   l: 'STAKEHOLDER CLASS' },
            { v: 'MULTI', l: 'CHAINS SUPPORTED' },
            { v: 'PILOT', l: 'PROGRAM STATUS' },
          ].map((k, i) => (
            <div key={k.l} style={{ padding: i === 0 ? '0 16px 0 0' : '0 16px', borderLeft: i > 0 ? '1px solid rgba(245,242,235,0.18)' : 'none' }}>
              <div style={{ fontFamily: SF_DISPLAY, fontSize: 36, fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em' }}>{k.v}</div>
              <div style={{ fontFamily: SF_SANS, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 10, color: 'rgba(245,242,235,0.5)' }}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AssetOverview() {
  return (
    <section style={{ background: SC.paper, borderTop: `1px solid ${SC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <SectionHeader
          coord="01 ·"
          eyebrow="ASSET OVERVIEW"
          title="What an underwater mineral asset can represent."
          body="Underwater mineral assets are complex, multi-stakeholder resource holdings. SABREX shows how Issatrix can structure them into compliant ownership units that institutional and government counterparties can hold, transfer, and report on."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: `1px solid ${SC.slate200}` }}>
          {[
            { coord: '01 · A', t: 'Mining rights',           b: 'Time-bounded extraction rights over a defined seabed concession area.' },
            { coord: '01 · B', t: 'Production participation', b: 'Pro-rata participation in production output, linked to lifecycle reporting.' },
            { coord: '01 · C', t: 'Reserve-linked exposure',  b: 'Tokenized exposure to certified, audit-grade reserve estimates.' },
            { coord: '01 · D', t: 'Project-linked ownership', b: 'Structured ownership in a project SPV operating under government license.' },
          ].map((it, i) => (
            <div key={it.t} style={{ padding: '32px 24px 32px 0', borderRight: i < 3 ? `1px solid ${SC.slate200}` : 'none', paddingLeft: i === 0 ? 0 : 24 }}>
              <div style={{ fontFamily: SF_MONO, fontSize: 11, color: SC.slate400, letterSpacing: '0.06em' }}>{it.coord}</div>
              <h3 style={{ fontFamily: SF_DISPLAY, fontWeight: 400, fontSize: 24, lineHeight: 1.2, color: SC.ink, margin: '14px 0 10px' }}>{it.t}</h3>
              <p style={{ fontFamily: SF_SANS, fontSize: 14, lineHeight: 1.6, color: SC.slate500, margin: 0 }}>{it.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solution() {
  const challenges = [
    'Large-scale asset valuation', 'Legal ownership and licensing',
    'Government and institutional stakeholders', 'Production and extraction timelines',
    'Investor eligibility and screening', 'Compliance and reporting',
    'Multi-stage asset lifecycle management',
  ];
  const rows = 8, cols = 12;
  const cellState = (r, c) => {
    const k = (r * 13 + c * 7) % 17;
    if (k < 5) return 'producing';
    if (k < 8) return 'reserved';
    if (k < 10) return 'audit';
    return 'open';
  };
  const fillFor = s => ({ producing: SC.ink, reserved: SC.aqua600, audit: SC.aqua300, open: 'transparent' }[s]);
  const counts = { producing: 0, reserved: 0, audit: 0, open: 0 };
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) counts[cellState(r, c)]++;

  return (
    <section style={{ background: SC.bone, borderTop: `1px solid ${SC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <SectionHeader
          coord="02 ·"
          eyebrow="THE CHALLENGE"
          title="Natural-resource projects are not standard issuances."
          body="They span government licensing, multi-stakeholder participation, multi-year extraction timelines, and audit-grade reporting. The infrastructure has to handle all of it under one set of controls."
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 64, alignItems: 'flex-start' }}>
          <div>
            <SEyebrow>WHAT THE INFRASTRUCTURE MUST HANDLE</SEyebrow>
            <div style={{ marginTop: 16, border: `1px solid ${SC.slate200}`, borderRadius: 2, fontFamily: SF_SANS, fontSize: 14, color: SC.ink }}>
              {challenges.map((ch, i) => (
                <div key={ch} style={{ padding: '14px 18px', borderBottom: i < challenges.length - 1 ? `1px solid ${SC.slate100}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: SF_MONO, fontSize: 11, color: SC.slate400, width: 28 }}>0{i + 1}</span>
                  <span>{ch}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40 }}>
              <SEyebrow color={SC.aqua700}>ISSATRIX SOLUTION</SEyebrow>
              <p style={{ fontFamily: SF_SANS, fontSize: 17, lineHeight: 1.6, color: SC.slate500, marginTop: 12, maxWidth: 480 }}>
                Issatrix structures the asset into controlled digital ownership units with investor onboarding, compliance rules, lifecycle reporting, and issuance workflows on one platform — across multiple blockchain ecosystems.
              </p>
            </div>
          </div>
          <div>
            <div style={{ border: `1px solid ${SC.slate200}`, background: SC.paper2, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: SF_MONO, fontSize: 10, color: SC.slate400, letterSpacing: '0.08em' }}>
                <span>SEABED · CONCESSION GRID</span><span>{rows * cols} BLOCKS · 100m³ EACH</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `24px repeat(${cols}, 1fr)`, gap: 3 }}>
                <div></div>
                {Array.from({ length: cols }).map((_, c) => (
                  <div key={c} style={{ fontFamily: SF_MONO, fontSize: 9, color: SC.slate400, textAlign: 'center' }}>{(c + 1).toString().padStart(2, '0')}</div>
                ))}
                {Array.from({ length: rows }).map((_, r) => (
                  <React.Fragment key={r}>
                    <div style={{ fontFamily: SF_MONO, fontSize: 9, color: SC.slate400, textAlign: 'right', alignSelf: 'center' }}>{String.fromCharCode(65 + r)}</div>
                    {Array.from({ length: cols }).map((_, c) => {
                      const s = cellState(r, c);
                      return <div key={c} style={{ aspectRatio: '1 / 1', background: fillFor(s), border: s === 'open' ? `1px dashed ${SC.slate300}` : 'none' }} />;
                    })}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${SC.slate200}`, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontFamily: SF_MONO, fontSize: 11, color: SC.slate500 }}>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, background: SC.ink, verticalAlign: 'middle', marginRight: 6 }} />PRODUCING · {counts.producing}</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, background: SC.aqua600, verticalAlign: 'middle', marginRight: 6 }} />RESERVED · {counts.reserved}</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, background: SC.aqua300, verticalAlign: 'middle', marginRight: 6 }} />AUDIT · {counts.audit}</span>
                <span><span style={{ display: 'inline-block', width: 10, height: 10, border: `1px dashed ${SC.slate300}`, verticalAlign: 'middle', marginRight: 6 }} />OPEN · {counts.open}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Modules() {
  const modules = [
    { t: 'Issuance engine',           d: 'Programmable minting against verified reserve blocks.' },
    { t: 'Investor onboarding',       d: 'KYC, AML, accreditation, jurisdictional eligibility.' },
    { t: 'Wallet whitelisting',       d: 'Allowlist-based transfer control on every chain.' },
    { t: 'Transfer control',          d: 'On-chain enforcement of jurisdictional and lockup rules.' },
    { t: 'Asset reporting dashboard', d: 'Production, audit, valuation, and lifecycle events.' },
    { t: 'Multi-chain deployment',    d: 'Ethereum L1, Base L2, Polygon, Avalanche.' },
    { t: 'Admin dashboard',           d: 'Issuer console for treasury and compliance operations.' },
    { t: 'Compliance data layer',     d: 'Document, attestation, and reporting registry.' },
  ];
  return (
    <section style={{ background: SC.bone, borderTop: `1px solid ${SC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <SectionHeader
          coord="04 ·"
          eyebrow="PLATFORM MODULES"
          title="The Issatrix modules used in SABREX."
          body="SABREX runs on a defined subset of the Issatrix platform. Each module is reusable across other use cases — the same engine that issues SABREX units issues AquaIndex and Hearstocks units."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: `1px solid ${SC.slate200}` }}>
          {modules.map((m, i) => (
            <div key={m.t} style={{ padding: '20px 18px', borderRight: (i + 1) % 4 !== 0 ? `1px solid ${SC.slate200}` : 'none', borderBottom: i < 4 ? `1px solid ${SC.slate200}` : 'none' }}>
              <div style={{ fontFamily: SF_MONO, fontSize: 10, color: SC.slate400, letterSpacing: '0.08em' }}>{(i + 1).toString().padStart(2, '0')}</div>
              <h4 style={{ fontFamily: SF_SANS, fontWeight: 500, fontSize: 16, color: SC.ink, margin: '8px 0 6px' }}>{m.t}</h4>
              <p style={{ fontFamily: SF_SANS, fontSize: 13, lineHeight: 1.55, color: SC.slate500, margin: 0 }}>{m.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section style={{ background: SC.ink, color: SC.paper, borderTop: '1px solid rgba(245,242,235,0.1)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <SEyebrow color={SC.aqua300} coord="05 ·">GET IN TOUCH</SEyebrow>
            <h2 style={{ fontFamily: SF_DISPLAY, fontWeight: 400, fontSize: 48, lineHeight: 1.08, letterSpacing: '-0.02em', color: SC.paper, margin: '20px 0 16px' }}>
              Explore how Issatrix supports natural-resource tokenization.
            </h2>
            <p style={{ fontFamily: SF_SANS, fontSize: 17, lineHeight: 1.6, color: 'rgba(245,242,235,0.7)', margin: 0, maxWidth: 580 }}>
              Speak with the SABREX team about applying the Issatrix issuance matrix to mineral and natural-resource assets in your jurisdiction.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <SBtn variant="accent" href={CONTACT_URL}>Get in touch with the team →</SBtn>
              <Link to="/" style={{ fontFamily: SF_SANS, fontWeight: 500, fontSize: 14, color: SC.paper, textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '0 18px', height: 40, border: `1px solid rgba(245,242,235,0.3)`, borderRadius: 4 }}>
                Back to Issatrix
              </Link>
            </div>
          </div>
          <div>
            <div style={{ border: '1px solid rgba(245,242,235,0.2)', padding: 24, fontFamily: SF_MONO, fontSize: 12, color: 'rgba(245,242,235,0.7)', letterSpacing: '0.04em' }}>
              <div style={{ fontFamily: SF_SANS, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'rgba(245,242,235,0.5)', marginBottom: 16 }}>▦ MX · 02 · SABREX</div>
              {[['ASSET', 'Underwater minerals'], ['REGIME', 'Government-backed · KSA'], ['CHAINS', 'Multi-chain'], ['STATUS', 'Pilot framework'], ['MATRIX', '12 × 8 extraction blocks']].map(([k, v], i, a) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < a.length - 1 ? '1px solid rgba(245,242,235,0.1)' : 'none' }}>
                  <span style={{ color: 'rgba(245,242,235,0.5)' }}>{k}</span>
                  <span style={{ color: SC.paper }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid rgba(245,242,235,0.18)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontFamily: SF_MONO, fontSize: 11, color: 'rgba(245,242,235,0.5)', letterSpacing: '0.04em' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link to="/#use-cases" style={{ color: SC.paper, textDecoration: 'none' }}>← ALL USE CASES</Link>
            <Link to="/" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>PLATFORM</Link>
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>GET IN TOUCH</a>
          </div>
          <span>© 2026 ISSATRIX · INFRASTRUCTURE FOR ISSUANCE</span>
        </div>
      </div>
    </section>
  );
}

export default function SabrexPage() {
  return (
    <>
      <ProgramHero />
      <AssetOverview />
      <Solution />
      <Modules />
      <CTA />
    </>
  );
}
