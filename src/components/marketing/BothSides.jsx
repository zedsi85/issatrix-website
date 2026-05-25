import { useState } from 'react';
import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow, Btn } from './Primitives.jsx';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';

function OwnersPipeline() {
  const stages = [
    { t: 'Asset',           sub: 'Real-world resource' },
    { t: 'Structuring',     sub: 'Wrapper · supply · rules' },
    { t: 'Token issuance',  sub: 'Programmatic minting' },
    { t: 'KYC',             sub: 'Identity · accreditation' },
    { t: 'Investor access', sub: 'Allowlist · transfers' },
    { t: 'DeFi / market',   sub: 'Secondary · collateral' },
  ];
  return (
    <div style={{ background: C.ink, color: C.paper, padding: 28, border: `1px solid ${C.ink}`, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(to right, rgba(245,242,235,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,242,235,0.06) 1px, transparent 1px)`, backgroundSize: '24px 24px', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(245,242,235,0.55)', letterSpacing: '0.1em' }}>
        <span>▦ ISSATRIX PIPELINE · OWNER VIEW</span>
        <span>● LIVE</span>
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {stages.map((s, i) => (
          <div key={s.t} style={{ position: 'relative', border: `1px solid rgba(245,242,235,0.18)`, background: 'rgba(245,242,235,0.04)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 28, height: 28, borderRadius: 999, border: `1px solid ${i === 2 ? C.aqua300 : 'rgba(245,242,235,0.4)'}`, background: i === 2 ? C.aqua600 : 'transparent', color: i === 2 ? C.paper : 'rgba(245,242,235,0.7)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontSize: 11 }}>{(i + 1).toString().padStart(2, '0')}</span>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 14, color: C.paper }}>{s.t}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: 'rgba(245,242,235,0.55)', letterSpacing: '0.04em', marginTop: 2 }}>{s.sub}</div>
              </div>
            </div>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: 'rgba(245,242,235,0.4)' }}>{i === 0 ? 'IN' : i === stages.length - 1 ? 'OUT' : '▮'}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', marginTop: 20, paddingTop: 14, borderTop: '1px solid rgba(245,242,235,0.18)', fontFamily: FONT_MONO, fontSize: 10, color: 'rgba(245,242,235,0.55)', letterSpacing: '0.08em', display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <span>WHITE-LABEL · MULTI-CHAIN · AUDIT-GRADE EVENTS</span>
        <span>6 STAGES · 1 INFRASTRUCTURE</span>
      </div>
    </div>
  );
}

function InvestorsCatalogue() {
  const classes = [
    { sym: 'WTR', t: 'Water reserves',     prog: 'AquaIndex',   units: '12.48M', chain: 'ETH L1',  status: 'verified' },
    { sym: 'MIN', t: 'Underwater minerals', prog: 'SABREX',      units: 'PILOT',  chain: 'MULTI',   status: 'pending'  },
    { sym: 'CAR', t: 'Vintage cars',        prog: 'Hearstocks',  units: '11,520', chain: 'BASE L2', status: 'verified' },
    { sym: 'AUR', t: 'Gold / commodities',  prog: 'Q3 pipeline', units: '—',      chain: '—',       status: 'draft'    },
    { sym: 'INF', t: 'Infrastructure',      prog: 'Q4 pipeline', units: '—',      chain: '—',       status: 'draft'    },
    { sym: 'PMK', t: 'Private markets',     prog: 'In design',   units: '—',      chain: '—',       status: 'draft'    },
  ];
  const dot = { verified: C.verified, pending: C.pending, draft: C.slate400 };
  return (
    <div>
      <div style={{ background: C.bone, border: `1px solid ${C.slate200}`, borderRadius: 2, padding: 20, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.08em' }}>
          <span>▦ INVESTOR · ASSET CLASSES</span><span>0x7a3c…ae04 · VERIFIED</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, borderTop: `1px solid ${C.slate200}`, borderLeft: `1px solid ${C.slate200}` }}>
          {classes.map(c => (
            <div key={c.sym} style={{ padding: 14, borderRight: `1px solid ${C.slate200}`, borderBottom: `1px solid ${C.slate200}`, background: c.status === 'draft' ? C.paper2 : C.bone }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.ink, letterSpacing: '0.08em' }}>{c.sym}</span>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 999, background: dot[c.status] }} />
              </div>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 14, color: C.ink, marginTop: 8 }}>{c.t}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: C.slate500, marginTop: 4 }}>{c.prog}</div>
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${C.slate100}`, display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 10, color: C.slate500, letterSpacing: '0.04em' }}>
                <span>{c.units}</span><span>{c.chain}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.slate200}`, display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, letterSpacing: '0.04em' }}>
          <span>6 ASSET CLASSES · 3 LIVE</span><span>KYC · WALLET · ELIGIBILITY · TRANSFER</span>
        </div>
      </div>
      <div style={{ marginTop: 16, padding: '12px 16px', border: `1px solid ${C.slate200}`, background: C.paper, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, letterSpacing: '0.06em', flexWrap: 'wrap' }}>
        <span>INVESTOR</span><span style={{ color: C.slate300 }}>→</span>
        <span>KYC</span><span style={{ color: C.slate300 }}>→</span>
        <span>ASSET CLASSES</span><span style={{ color: C.slate300 }}>→</span>
        <span>TRADING / DEFI / PORTFOLIO</span>
      </div>
    </div>
  );
}

function OwnersPanel() {
  const benefits = [
    { coord: '01', t: 'Full tokenization pipeline',       b: 'Asset structuring, token issuance, investor onboarding, compliance rules, minting, transfer control, reporting, and redemption — end to end.' },
    { coord: '02', t: 'White-label infrastructure',       b: 'Operate Issatrix as a dedicated tokenization platform, branded and configured for the asset owner.' },
    { coord: '03', t: 'Compliance-ready investor access', b: 'Built-in KYC and AML, wallet whitelisting, transfer restrictions, investor eligibility, and controlled participation.' },
    { coord: '04', t: 'Multi-chain deployment',           b: 'Deploy tokenized assets across selected blockchain ecosystems depending on liquidity, compliance, and distribution strategy.' },
    { coord: '05', t: 'DeFi & secondary liquidity',       b: 'Prepare tokenized assets for future DeFi integrations, collateralization, lending, trading, and controlled secondary-market access.' },
    { coord: '06', t: 'Asset lifecycle management',       b: 'Manage issuance, ownership records, investor activity, reporting, redemptions, distributions, and asset updates from one infrastructure layer.' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 64, alignItems: 'flex-start' }}>
      <div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.02em', color: C.ink, margin: '0 0 28px' }}>
          Tokenize, manage, and distribute real-world assets through a complete issuance infrastructure.
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: `1px solid ${C.slate200}`, borderLeft: `1px solid ${C.slate200}` }}>
          {benefits.map(it => (
            <div key={it.coord} style={{ padding: '20px 20px', background: C.bone, borderRight: `1px solid ${C.slate200}`, borderBottom: `1px solid ${C.slate200}` }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.08em' }}>A · {it.coord}</div>
              <h4 style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 15, color: C.ink, margin: '10px 0 6px' }}>{it.t}</h4>
              <p style={{ fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.55, color: C.slate500, margin: 0 }}>{it.b}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Btn variant="primary" href="#asset-structuring-tool">Launch your tokenized asset →</Btn>
          <Btn variant="ghost" href="/issuance">See the issuance flow</Btn>
        </div>
      </div>
      <OwnersPipeline />
    </div>
  );
}

function InvestorsPanel() {
  const benefits = [
    { coord: '01', t: 'Seamless access to tokenized asset classes',  b: 'Discover and access tokenized exposure to water reserves, commodities, real estate, collectibles, infrastructure, private markets, and other alternative assets.' },
    { coord: '02', t: 'Liquidity for illiquid assets',               b: 'Issatrix helps transform traditionally illiquid real-world assets into transferable digital units, enabling flexible ownership and potential secondary-market access.' },
    { coord: '03', t: 'Simple onboarding',                           b: 'A smoother investor journey with KYC, wallet connection, eligibility checks, and access to approved tokenized asset opportunities.' },
    { coord: '04', t: 'Trading and transfer features',               b: 'Hold, transfer, and potentially trade tokenized assets under compliant rules and controlled market conditions.' },
    { coord: '05', t: 'DeFi-ready asset utility',                    b: 'Tokenized assets can be designed for future DeFi use cases — collateral, lending, borrowing, liquidity, and structured yield — where legally appropriate.' },
    { coord: '06', t: 'Transparent ownership data',                  b: 'Each tokenized unit can be linked to ownership records, asset data, compliance status, transaction history, and lifecycle events.' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 64, alignItems: 'flex-start' }}>
      <div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.02em', color: C.ink, margin: '0 0 28px' }}>
          Access tokenized real-world assets through a seamless, compliant, and programmable investment experience.
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderTop: `1px solid ${C.slate200}`, borderLeft: `1px solid ${C.slate200}` }}>
          {benefits.map(it => (
            <div key={it.coord} style={{ padding: '20px 20px', background: C.bone, borderRight: `1px solid ${C.slate200}`, borderBottom: `1px solid ${C.slate200}` }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.08em' }}>B · {it.coord}</div>
              <h4 style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 15, color: C.ink, margin: '10px 0 6px' }}>{it.t}</h4>
              <p style={{ fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.55, color: C.slate500, margin: 0 }}>{it.b}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Btn variant="primary" href={CONTACT_URL}>Explore tokenized assets →</Btn>
          <Btn variant="ghost" href="/#use-cases">View asset classes</Btn>
        </div>
      </div>
      <InvestorsCatalogue />
    </div>
  );
}

export default function BothSides() {
  const [tab, setTab] = useState('owners');
  return (
    <section id="for-you" style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'flex-end', marginBottom: 56 }}>
          <div>
            <Eyebrow coord="04 ·">BUILT FOR BOTH SIDES</Eyebrow>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.02em', color: C.ink, margin: '20px 0 0' }}>
              Issatrix connects asset owners with the next generation of digital investors.
            </h2>
          </div>
          <p style={{ fontFamily: FONT_SANS, fontSize: 17, lineHeight: 1.65, color: C.slate500, margin: 0, maxWidth: 580 }}>
            Issatrix is not only a tokenization backend. It is an infrastructure layer that helps asset owners structure, issue, manage, and distribute tokenized assets — while giving investors seamless access to new real-world asset opportunities.
          </p>
        </div>

        <div role="tablist" style={{ display: 'flex', gap: 8, padding: 6, background: C.paper2, border: `1px solid ${C.slate200}`, borderRadius: 4, width: 'fit-content', marginBottom: 48 }}>
          {[
            { id: 'owners',    label: 'For asset owners', coord: 'A · 01' },
            { id: 'investors', label: 'For investors',    coord: 'B · 01' },
          ].map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} role="tab" aria-selected={active} onClick={() => setTab(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, height: 44, padding: '0 18px', borderRadius: 2, border: 'none', cursor: 'pointer', background: active ? C.ink : 'transparent', color: active ? C.paper : C.slate500, fontFamily: FONT_SANS, fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', transition: 'background 160ms cubic-bezier(0.2,0,0,1), color 160ms cubic-bezier(0.2,0,0,1)' }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: active ? 'rgba(245,242,235,0.55)' : C.slate400, letterSpacing: '0.06em' }}>{t.coord}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {tab === 'owners' ? <OwnersPanel /> : <InvestorsPanel />}

        <div style={{ marginTop: 56, paddingTop: 20, borderTop: `1px solid ${C.slate200}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontFamily: FONT_MONO, fontSize: 11, color: C.slate500, letterSpacing: '0.04em' }}>
          <span>FOR ASSET OWNERS · INFRASTRUCTURE TO LAUNCH TOKENIZED ASSETS</span>
          <span>FOR INVESTORS · THE GATEWAY TO ACCESS THEM</span>
        </div>
      </div>
    </section>
  );
}
