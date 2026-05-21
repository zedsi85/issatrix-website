import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO } from './Primitives.jsx';
import { PageSectionHeader, HairlineGrid } from './PageBlocks.jsx';

export function CompliancePillars() {
  const pillars = [
    { coord: '01 · A', t: 'Investor onboarding', b: 'KYC, AML, accreditation, and source-of-funds checks before any transfer.' },
    { coord: '01 · B', t: 'Jurisdictional rules', b: 'Eligibility evaluated on-chain by holder region; rules updated centrally.' },
    { coord: '01 · C', t: 'Transfer control',    b: 'Allowlist enforcement, lockups, vesting, and cool-down windows.' },
    { coord: '01 · D', t: 'Audit-grade events',  b: 'Every lifecycle event logged, signed, and retrievable for regulators.' },
  ];
  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="01 ·"
          eyebrow="THE FOUR PILLARS"
          title="Compliance is built into the matrix."
          body="Compliance isn't a layer on top of issuance — it is the issuance. The matrix won't transfer, redeem, or settle a unit unless every required check has passed."
        />
        <HairlineGrid items={pillars} columns={4} />
      </div>
    </section>
  );
}

export function OnboardingFlow() {
  const steps = [
    { n: '01', t: 'Identity',        d: 'Investor identity verified through KYC providers and document checks.' },
    { n: '02', t: 'Accreditation',   d: "Status confirmed per the program's regulatory regime (Reg D, Reg S, etc.)." },
    { n: '03', t: 'Source of funds', d: 'AML and provenance checks completed before allowlist approval.' },
    { n: '04', t: 'Jurisdiction',    d: "Region eligibility computed against the program's allowed jurisdictions." },
    { n: '05', t: 'Allowlist',       d: 'Wallet added to the on-chain allowlist; transfers become possible.' },
    { n: '06', t: 'Continuous',      d: 'Re-screening on a defined cadence; revocations propagate to the matrix.' },
  ];
  return (
    <section style={{ background: C.bone, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="02 ·"
          eyebrow="INVESTOR ONBOARDING"
          title="Six checks. One verdict."
          body="A wallet becomes a holder only after all six checks resolve. The platform records each step with attestations attached to the holder record."
        />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
          <div style={{ position: 'absolute', left: '4%', right: '4%', top: 15, height: 1, background: C.slate200, zIndex: 0 }} />
          {steps.map(s => (
            <div key={s.n} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 999, background: C.paper,
                border: `1px solid ${C.slate300}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_MONO, fontSize: 11, color: C.ink, zIndex: 1,
              }}>{s.n}</div>
              <div style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 14, color: C.ink }}>{s.t}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.55, color: C.slate500 }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RuleBadge({ s }) {
  const pal = {
    enforced: { bg: '#E6F0E9', fg: '#2C7A4B', glyph: '●', t: 'ON-CHAIN' },
    window:   { bg: '#F5ECDC', fg: '#A66B12', glyph: '◐', t: 'WINDOWED' },
    manual:   { bg: '#EFEBE1', fg: '#4D483F', glyph: '○', t: 'MANUAL' },
  }[s];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px',
      borderRadius: 999, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.04em',
      background: pal.bg, color: pal.fg,
    }}>{pal.glyph} {pal.t}</span>
  );
}

export function TransferRules() {
  const rules = [
    { id: 'R-01', t: 'Allowlist only',           who: 'Holder ∈ approved allowlist', s: 'enforced' },
    { id: 'R-02', t: 'Jurisdiction eligibility',  who: "Holder region ∈ program's allowed regions", s: 'enforced' },
    { id: 'R-03', t: 'Accreditation status',      who: "Holder accredited at the program's threshold", s: 'enforced' },
    { id: 'R-04', t: 'Lockup window',             who: 'Time since acquisition ≥ lockup period', s: 'enforced' },
    { id: 'R-05', t: 'Concentration limit',       who: 'Resulting holdings ≤ per-holder cap', s: 'enforced' },
    { id: 'R-06', t: 'Sanctions / freeze',        who: 'Holder not on sanctions or program-level freeze', s: 'enforced' },
    { id: 'R-07', t: 'Redemption window',         who: 'Redeem requested within active window', s: 'window' },
    { id: 'R-08', t: 'Issuer override',           who: 'Issuer-signed exception (audit-trailed)', s: 'manual' },
  ];
  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="03 ·"
          eyebrow="TRANSFER RULES"
          title="Every transfer is a series of binary checks."
          body="Each rule resolves to true or false on-chain. A transfer requires all enforced rules to pass; manual overrides exist but are audit-trailed."
        />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT_SANS, fontSize: 13 }}>
          <thead>
            <tr style={{ borderTop: `1px solid ${C.slate200}`, borderBottom: `1px solid ${C.slate200}` }}>
              {['Rule', 'Name', 'Enforcement clause', 'Status'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '12px 16px',
                  fontFamily: FONT_SANS, fontWeight: 500, fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.12em', color: C.slate400,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < rules.length - 1 ? `1px solid ${C.slate100}` : 'none' }}>
                <td style={{ padding: '14px 16px', fontFamily: FONT_MONO, fontSize: 12, color: C.slate500 }}>{r.id}</td>
                <td style={{ padding: '14px 16px', color: C.ink, fontWeight: 500 }}>{r.t}</td>
                <td style={{ padding: '14px 16px', color: C.slate500, fontFamily: FONT_MONO, fontSize: 12 }}>{r.who}</td>
                <td style={{ padding: '14px 16px' }}><RuleBadge s={r.s} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function AuditTrail() {
  const events = [
    { t: '14:32:08', coord: 'A · 47', kind: 'TRANSFER', text: 'AQX-A · 1,200 units · 0x7a3c…ae04 → 0x9F2c…1102 · rules R-01..R-06 passed' },
    { t: '14:18:51', coord: 'A · 46', kind: 'ONBOARD',  text: '0x55de…3a18 verified · Reg D 506(c) · EU jurisdiction · accreditation attested' },
    { t: '13:55:02', coord: 'A · 45', kind: 'REDEEM',   text: 'REA-11 · 4,800 units queued for Q2 redemption window' },
    { t: '13:41:30', coord: 'A · 44', kind: 'ISSUE',    text: 'AQX-A · 80,000 units minted by treasury · reserve attestation #aragon-q1' },
    { t: '12:12:14', coord: 'A · 43', kind: 'HOLD',     text: 'CCX-04 · transfer hold applied by compliance · 0x412e…9bb8' },
    { t: '11:08:00', coord: 'A · 42', kind: 'SCREEN',   text: 'Continuous re-screening complete · 1,284 holders · 0 revocations' },
  ];
  const kindColor = {
    TRANSFER: C.aqua700, ONBOARD: C.aqua700, REDEEM: C.pending,
    ISSUE: C.verified, HOLD: C.halted, SCREEN: C.slate500,
  };
  return (
    <section style={{ background: C.bone, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="04 ·"
          eyebrow="AUDIT TRAIL"
          title="The compliance ledger is the audit log."
          body="Every lifecycle event — onboard, transfer, hold, redeem, screen — is recorded on-chain with the rules it triggered. Regulators and auditors see the same view as the issuer."
        />
        <div style={{ border: `1px solid ${C.slate200}`, borderRadius: 2, background: C.paper, fontFamily: FONT_MONO, fontSize: 12 }}>
          {events.map((e, i) => (
            <div key={e.coord} style={{
              display: 'grid', gridTemplateColumns: '90px 70px 90px 1fr', alignItems: 'center', gap: 16,
              padding: '12px 16px',
              borderBottom: i < events.length - 1 ? `1px solid ${C.slate100}` : 'none',
            }}>
              <span style={{ color: C.slate400 }}>{e.t}</span>
              <span style={{ color: C.slate400 }}>{e.coord}</span>
              <span style={{ color: kindColor[e.kind], letterSpacing: '0.04em' }}>{e.kind}</span>
              <span style={{ color: C.ink }}>{e.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
