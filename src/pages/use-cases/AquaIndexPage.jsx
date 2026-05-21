import React from 'react';
import { Link } from 'react-router-dom';
import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO, Eyebrow, Btn } from '../../components/marketing/Primitives.jsx';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';

const AC = C;
const AF_DISPLAY = FONT_DISPLAY;
const AF_SANS = FONT_SANS;
const AF_MONO = FONT_MONO;

function AEyebrow({ coord, children, color }) {
  return <Eyebrow coord={coord} color={color}>{children}</Eyebrow>;
}

function ABtn({ variant, href, children, onClick }) {
  const map = { accent: 'accent', secondary: 'secondary', ghost: 'ghost' };
  return <Btn variant={map[variant] || 'primary'} href={href} onClick={onClick}>{children}</Btn>;
}

function ProgramHero() {
  return (
    <section style={{ position: 'relative', background: AC.ink, color: AC.paper, overflow: 'hidden' }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} preserveAspectRatio="none" viewBox="0 0 1200 600">
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M0 ${80 + i * 70} Q 150 ${50 + i * 70} 300 ${80 + i * 70} T 600 ${80 + i * 70} T 900 ${80 + i * 70} T 1200 ${80 + i * 70}`} stroke="#6BAAB2" strokeWidth="1.2" fill="none" />
        ))}
      </svg>

      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <svg viewBox="0 0 320 40" width={120} height={15}>
              <text x="0" y="29" fill={AC.paper} fontFamily="'Geist', system-ui, sans-serif" fontWeight={500} fontSize={34} letterSpacing={6}>ISSATRIX</text>
            </svg>
          </Link>
          <span style={{ fontFamily: AF_MONO, color: 'rgba(245,242,235,0.4)' }}>×</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/assets/aquaindex-mark.svg" style={{ width: 22, height: 22 }} alt="AquaIndex" />
            <span style={{ fontFamily: AF_SANS, fontSize: 16, fontWeight: 500, letterSpacing: '0.02em' }}>AquaIndex</span>
          </div>
        </div>
        <div style={{ fontFamily: AF_MONO, fontSize: 11, color: 'rgba(245,242,235,0.5)', letterSpacing: '0.06em' }}>
          PROGRAM · AQX-A · ETHEREUM L1
        </div>
      </div>

      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '64px 32px 80px' }}>
        <AEyebrow coord="▦ A · 01" color={AC.aqua300}>FIRST MAJOR USE CASE</AEyebrow>
        <h1 style={{
          fontFamily: AF_DISPLAY, fontWeight: 400, fontSize: 'clamp(48px, 6vw, 84px)',
          lineHeight: 1.08, letterSpacing: '-0.02em', margin: '20px 0 0', color: AC.paper, maxWidth: 980,
        }}>
          Real water reserves, represented as programmable units.
        </h1>
        <p style={{ fontFamily: AF_SANS, fontSize: 20, lineHeight: 1.55, color: 'rgba(245,242,235,0.7)', marginTop: 24, maxWidth: 620 }}>
          AquaIndex is the first program built on Issatrix infrastructure. Verified water assets from the Aragón basin are issued as tokenized units with full lifecycle controls and quarterly redemption.
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <ABtn variant="accent" href={CONTACT_URL}>Request allocation →</ABtn>
          <ABtn variant="secondary" href="/docs"><span style={{ color: AC.paper }}>Read the methodology</span></ABtn>
        </div>

        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid rgba(245,242,235,0.2)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[
            { v: '$420.0M', l: 'NOTIONAL' },
            { v: '12.48M',  l: 'UNITS' },
            { v: '1,284',   l: 'HOLDERS' },
            { v: '4.8 yr',  l: 'AVG TENURE' },
            { v: '7.2%',    l: 'YIELD TO DATE' },
          ].map((k, i) => (
            <div key={k.l} style={{ padding: i === 0 ? '0 16px 0 0' : '0 16px', borderLeft: i > 0 ? '1px solid rgba(245,242,235,0.18)' : 'none' }}>
              <div style={{ fontFamily: AF_DISPLAY, fontSize: 44, fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em' }}>{k.v}</div>
              <div style={{ fontFamily: AF_SANS, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 10, color: 'rgba(245,242,235,0.5)' }}>{k.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WaterMatrix() {
  const rows = 6, cols = 12;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const seed = (r * 7 + c * 3) % 11;
      row.push(seed < 5 ? 'filled' : seed < 7 ? 'queued' : seed < 9 ? 'reserved' : 'open');
    }
    cells.push(row);
  }
  const fillFor = s => ({ filled: AC.ink, queued: AC.aqua600, reserved: AC.aqua100, open: 'transparent' }[s]);

  return (
    <section style={{ background: AC.paper, borderTop: `1px solid ${AC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <AEyebrow coord="A · 02">RESERVE STRUCTURE</AEyebrow>
            <h2 style={{ fontFamily: AF_DISPLAY, fontWeight: 400, fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.02em', color: AC.ink, margin: '20px 0 16px' }}>
              The reserve, as a matrix.
            </h2>
            <p style={{ fontFamily: AF_SANS, fontSize: 16, lineHeight: 1.65, color: AC.slate500, maxWidth: 480, margin: 0 }}>
              Each cell represents a verified 100,000 m³ block of contracted water reserve. Units are minted only against filled cells. Queued cells are under audit and not yet issuable.
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { c: AC.ink,        b: false, l: 'Filled — issued to holders' },
                { c: AC.aqua600,    b: false, l: 'Queued — minting this quarter' },
                { c: AC.aqua100,    b: false, l: 'Reserved — contracted, audit pending' },
                { c: 'transparent', b: true,  l: 'Open — capacity available' },
              ].map(k => (
                <div key={k.l} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 18, height: 18, background: k.c, border: k.b ? `1px dashed ${AC.slate300}` : 'none' }} />
                  <span style={{ fontFamily: AF_SANS, fontSize: 13, color: AC.ink }}>{k.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ border: `1px solid ${AC.slate200}`, background: AC.bone, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: AF_MONO, fontSize: 10, color: AC.slate400, letterSpacing: '0.08em' }}>
                <span>BASIN · ARAGÓN</span><span>72 BLOCKS · 7.2M m³</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '24px repeat(12, 1fr)', gap: 3 }}>
                <div></div>
                {Array.from({ length: cols }).map((_, c) => (
                  <div key={c} style={{ fontFamily: AF_MONO, fontSize: 9, color: AC.slate400, textAlign: 'center' }}>{(c + 1).toString().padStart(2, '0')}</div>
                ))}
                {cells.map((row, r) => (
                  <React.Fragment key={r}>
                    <div style={{ fontFamily: AF_MONO, fontSize: 9, color: AC.slate400, textAlign: 'right', alignSelf: 'center' }}>{String.fromCharCode(65 + r)}</div>
                    {row.map((s, c) => (
                      <div key={c} style={{ aspectRatio: '1 / 1', background: fillFor(s), border: s === 'open' ? `1px dashed ${AC.slate300}` : 'none' }} />
                    ))}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontFamily: AF_MONO, fontSize: 11, color: AC.slate500 }}>
                <span>FILLED 41 · QUEUED 14</span>
                <span>RESERVED 11 · OPEN 6</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RedemptionSchedule() {
  const rows = [
    { q: 'Q2 · 2026', date: 'Jun 30', status: 'OPEN',    queue: '4,800',   cap: '120,000', t: 'pending' },
    { q: 'Q1 · 2026', date: 'Mar 31', status: 'SETTLED', queue: '102,400', cap: '120,000', t: 'verified' },
    { q: 'Q4 · 2025', date: 'Dec 31', status: 'SETTLED', queue: '94,800',  cap: '120,000', t: 'verified' },
    { q: 'Q3 · 2025', date: 'Sep 30', status: 'SETTLED', queue: '88,200',  cap: '120,000', t: 'verified' },
    { q: 'Q2 · 2025', date: 'Jun 30', status: 'SETTLED', queue: '71,400',  cap: '120,000', t: 'verified' },
  ];
  return (
    <section style={{ background: AC.bone, borderTop: `1px solid ${AC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <AEyebrow coord="A · 03">REDEMPTION</AEyebrow>
            <h2 style={{ fontFamily: AF_DISPLAY, fontWeight: 400, fontSize: 44, lineHeight: 1.1, letterSpacing: '-0.02em', color: AC.ink, margin: '20px 0 0' }}>
              Quarterly redemption schedule
            </h2>
          </div>
          <ABtn variant="secondary" href={CONTACT_URL}><span style={{ color: AC.ink }}>View full schedule →</span></ABtn>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: AF_SANS, fontSize: 14 }}>
          <thead>
            <tr style={{ borderTop: `1px solid ${AC.slate200}`, borderBottom: `1px solid ${AC.slate200}` }}>
              {['Window', 'Settlement date', 'Status', 'Units queued', 'Window cap', 'Utilization'].map((h, i) => (
                <th key={h} style={{ textAlign: i >= 3 && i <= 4 ? 'right' : 'left', padding: '12px 16px', paddingLeft: i === 0 ? 0 : 16, fontFamily: AF_SANS, fontWeight: 500, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: AC.slate400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const pct = (parseInt(r.queue.replace(/[^0-9]/g, '')) / 120000 * 100).toFixed(0);
              return (
                <tr key={r.q} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${AC.slate100}` : 'none' }}>
                  <td style={{ padding: '16px 16px 16px 0', color: AC.ink, fontWeight: 500 }}>{r.q}</td>
                  <td style={{ padding: '16px', color: AC.slate500, fontFamily: AF_MONO, fontSize: 13 }}>{r.date}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ fontFamily: AF_MONO, fontSize: 10, letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 999, background: r.t === 'pending' ? '#F5ECDC' : '#E6F0E9', color: r.t === 'pending' ? AC.pending : AC.verified }}>
                      {r.t === 'pending' ? '◐ ' : '● '}{r.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontFamily: AF_MONO, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: AC.ink }}>{r.queue}</td>
                  <td style={{ padding: '16px', fontFamily: AF_MONO, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: AC.slate500 }}>{r.cap}</td>
                  <td style={{ padding: '16px', width: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, height: 6, background: AC.slate100, borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: r.t === 'pending' ? AC.aqua600 : AC.ink }} />
                      </div>
                      <span style={{ fontFamily: AF_MONO, fontSize: 12, color: AC.slate500, width: 36, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Disclosures() {
  const sections = [
    { n: '01', title: 'Asset representation', body: 'Each AQX unit corresponds to a verified, contracted right to 0.10 m³ of water reserve from the Aragón basin, audited quarterly by an independent hydrology firm. Units are not synthetic.' },
    { n: '02', title: 'Issuance & supply',    body: 'Supply is bounded by audited reserve blocks. New units may only be minted against blocks marked Filled in the reserve matrix. The treasury cannot mint against open or reserved cells.' },
    { n: '03', title: 'Transfer control',     body: 'AQX is a transfer-controlled token. Holders must be accredited under Reg D 506(c) and pass jurisdictional checks. The allowlist is maintained by the compliance module of Issatrix and enforced on-chain.' },
    { n: '04', title: 'Redemption mechanics', body: 'Holders may queue units for redemption in any quarter. Each window has a capped capacity (120,000 units). Surplus demand rolls forward to the following window in queue order.' },
    { n: '05', title: 'Risk disclosure',      body: 'Past settlement integrity does not guarantee future performance. Water reserve availability is subject to regulatory, climatic, and operational risks. This is not an offer to sell securities.' },
  ];
  return (
    <section style={{ background: AC.paper, borderTop: `1px solid ${AC.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 64, alignItems: 'flex-start' }}>
          <div>
            <AEyebrow coord="A · 04">DISCLOSURES</AEyebrow>
            <h2 style={{ fontFamily: AF_DISPLAY, fontWeight: 400, fontSize: 36, lineHeight: 1.1, letterSpacing: '-0.02em', color: AC.ink, margin: '20px 0 16px' }}>
              The structure, in plain language.
            </h2>
            <p style={{ fontFamily: AF_SANS, fontSize: 14, lineHeight: 1.7, color: AC.slate500, margin: 0 }}>
              Full term sheet, audit reports, and on-chain registry are available to qualified investors.
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8, fontFamily: AF_MONO, fontSize: 12, color: AC.slate500 }}>
              <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" style={{ color: AC.aqua700 }}>↗ Term sheet (PDF, 24p)</a>
              <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" style={{ color: AC.aqua700 }}>↗ Q1 '26 audit report</a>
              <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" style={{ color: AC.aqua700 }}>↗ On-chain registry</a>
            </div>
          </div>
          <div>
            {sections.map((s, i) => (
              <div key={s.n} style={{ padding: '24px 0', borderTop: `1px solid ${AC.slate200}`, borderBottom: i === sections.length - 1 ? `1px solid ${AC.slate200}` : 'none', display: 'grid', gridTemplateColumns: '64px 1fr', gap: 16 }}>
                <div style={{ fontFamily: AF_MONO, fontSize: 12, color: AC.slate400, paddingTop: 4 }}>{s.n}</div>
                <div>
                  <h3 style={{ fontFamily: AF_SANS, fontWeight: 500, fontSize: 18, color: AC.ink, margin: '0 0 6px' }}>{s.title}</h3>
                  <p style={{ fontFamily: AF_SANS, fontSize: 15, lineHeight: 1.65, color: AC.slate500, margin: 0, maxWidth: 620 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AquaCTA() {
  return (
    <section style={{ background: AC.ink, color: AC.paper }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <Eyebrow coord="◉" color={AC.aqua300}>GET IN TOUCH</Eyebrow>
        <h2 style={{ fontFamily: AF_DISPLAY, fontWeight: 400, fontSize: 48, lineHeight: 1.08, letterSpacing: '-0.02em', color: AC.paper, margin: '20px 0 16px', maxWidth: 720 }}>
          Interested in AquaIndex allocation?
        </h2>
        <p style={{ fontFamily: AF_SANS, fontSize: 17, lineHeight: 1.6, color: 'rgba(245,242,235,0.7)', margin: 0, maxWidth: 580 }}>
          Speak with the AquaIndex team about qualifying for the current allocation window.
        </p>
        <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Btn variant="accent" href={CONTACT_URL}>Get in touch with the team →</Btn>
          <Link to="/" style={{ fontFamily: AF_SANS, fontWeight: 500, fontSize: 14, color: AC.paper, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            ← Back to Issatrix
          </Link>
        </div>
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid rgba(245,242,235,0.18)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontFamily: AF_MONO, fontSize: 11, color: 'rgba(245,242,235,0.5)', letterSpacing: '0.04em' }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Link to="/#use-cases" style={{ color: AC.paper, textDecoration: 'none' }}>← ALL USE CASES</Link>
            <Link to="/" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>PLATFORM</Link>
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(245,242,235,0.7)', textDecoration: 'none' }}>GET IN TOUCH</a>
          </div>
          <span>© 2026 ISSATRIX · INFRASTRUCTURE FOR ISSUANCE</span>
        </div>
      </div>
    </section>
  );
}

export default function AquaIndexPage() {
  return (
    <>
      <ProgramHero />
      <WaterMatrix />
      <RedemptionSchedule />
      <Disclosures />
      <AquaCTA />
    </>
  );
}
