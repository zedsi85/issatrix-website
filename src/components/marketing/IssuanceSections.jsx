import React from 'react';
import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO } from './Primitives.jsx';
import { PageSectionHeader, HairlineGrid } from './PageBlocks.jsx';

export function IssuanceLifecycle() {
  const stages = [
    { n: '01', t: 'Structuring',      d: 'Define supply, asset wrapper, jurisdictions, and lifecycle stages before launch.' },
    { n: '02', t: 'Onboarding',       d: 'Bring qualified investors onto the matrix with built-in compliance checks.' },
    { n: '03', t: 'Issuance',         d: 'Programmatic minting against verified asset blocks across selected chains.' },
    { n: '04', t: 'Transfer control', d: 'Enforce allowlist, jurisdictional, and lockup rules on every on-chain transfer.' },
    { n: '05', t: 'Redemption',       d: 'Manage redemption queues, distributions, and settlement events transparently.' },
  ];
  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="01 ·"
          eyebrow="ISSUANCE LIFECYCLE"
          title="Five controlled stages. One platform."
          body="Every program on Issatrix moves through the same lifecycle. Each stage is observable, enforceable, and auditable — no off-chain choreography required."
        />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          <div style={{ position: 'absolute', left: '5%', right: '5%', top: 15, height: 1, background: C.slate200, zIndex: 0 }} />
          {stages.map(s => (
            <div key={s.n} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 999, background: C.bone,
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

export function TokenStructuring() {
  const options = [
    { coord: '02 · A', t: 'Transfer-controlled', b: 'Tokens only move between allowlisted holders under explicit rules.' },
    { coord: '02 · B', t: 'Jurisdiction-aware',  b: 'Eligibility evaluated on-chain by holder region and accreditation.' },
    { coord: '02 · C', t: 'Lockup-enforced',     b: 'Time-based lockups and vesting schedules baked into the contract.' },
    { coord: '02 · D', t: 'Programmable supply', b: 'Mint and burn bounded by reserve verification and treasury rules.' },
    { coord: '02 · E', t: 'Multi-chain',         b: 'Deploy to Ethereum L1, Base L2, Polygon, and Avalanche from one console.' },
    { coord: '02 · F', t: 'Redeemable',          b: 'Quarterly, semi-annual, or manual redemption windows out of the box.' },
    { coord: '02 · G', t: 'Audit-grade events',  b: 'Every lifecycle event logged on-chain with cryptographic attestation.' },
    { coord: '02 · H', t: 'SDK-driven',          b: 'Issuer SDK lets engineering teams script issuance and reporting.' },
  ];
  return (
    <section style={{ background: C.bone, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="02 ·"
          eyebrow="TOKEN STRUCTURING"
          title="Configure the matrix to fit the asset."
          body="Token behavior is configured per program: transfer rules, jurisdictional gating, lockups, and redemption windows. Pick the combination that matches the issuance."
        />
        <HairlineGrid items={options} columns={4} />
      </div>
    </section>
  );
}

export function MultiChain() {
  const chains = [
    { name: 'Ethereum L1', tag: 'Settlement',   note: 'Primary settlement layer for high-value institutional issuance.' },
    { name: 'Base L2',     tag: 'Throughput',   note: 'Lower-cost transfers and redemption events for fractional programs.' },
    { name: 'Polygon',     tag: 'Reach',        note: 'Broad ecosystem reach for collateralised and asset-backed tokens.' },
    { name: 'Avalanche',   tag: 'Subnet-ready', note: 'Government and consortium subnets with isolated compliance domains.' },
  ];
  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="03 ·"
          eyebrow="MULTI-CHAIN DEPLOYMENT"
          title="Issue once. Deploy to the chains the program needs."
          body="A single matrix can mirror across multiple chains while keeping investor lists, transfer controls, and audit logs synchronised."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {chains.map(ch => (
            <div key={ch.name} style={{
              border: `1px solid ${C.slate200}`, background: C.bone,
              padding: '20px 18px', borderRadius: 2,
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.aqua700, letterSpacing: '0.08em' }}>● {ch.tag.toUpperCase()}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: C.ink, marginTop: 8, letterSpacing: '-0.01em' }}>{ch.name}</div>
              <p style={{ fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.6, color: C.slate500, margin: '10px 0 0' }}>{ch.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IssuanceMatrix() {
  const rows = 6, cols = 14;
  const cellState = (r, c) => {
    const k = (r * 13 + c * 7) % 17;
    if (k < 6) return 'minted';
    if (k < 9) return 'reserved';
    if (k < 11) return 'pending';
    return 'open';
  };
  const fillFor = s => ({
    minted: C.ink, reserved: C.aqua600, pending: C.aqua300, open: 'transparent',
  }[s]);
  return (
    <section style={{ background: C.bone, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="04 ·"
          eyebrow="THE MATRIX, AT THE PROGRAM LEVEL"
          title="An issuance program, observed."
          body="Every program renders into the same matrix view: rows are tranches, columns are lifecycle stages, cells are tokenised units in a known state. Audit-ready by default."
        />
        <div style={{ border: `1px solid ${C.slate200}`, background: C.paper2, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.08em' }}>
            <span>PROGRAM · MATRIX VIEW</span><span>{rows * cols} UNITS · LIFECYCLE-STAGED</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `28px repeat(${cols}, 1fr)`, gap: 3 }}>
            <div></div>
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.slate400, textAlign: 'center' }}>{(c + 1).toString().padStart(2, '0')}</div>
            ))}
            {Array.from({ length: rows }).map((_, r) => (
              <React.Fragment key={r}>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: C.slate400, textAlign: 'right', alignSelf: 'center' }}>{String.fromCharCode(65 + r)}</div>
                {Array.from({ length: cols }).map((_, c) => {
                  const s = cellState(r, c);
                  return (
                    <div key={c} style={{
                      aspectRatio: '1 / 1', background: fillFor(s),
                      border: s === 'open' ? `1px dashed ${C.slate300}` : 'none',
                    }} />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.slate200}`,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontFamily: FONT_MONO, fontSize: 11, color: C.slate500,
          }}>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: C.ink, verticalAlign: 'middle', marginRight: 6 }} />MINTED</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: C.aqua600, verticalAlign: 'middle', marginRight: 6 }} />RESERVED</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, background: C.aqua300, verticalAlign: 'middle', marginRight: 6 }} />PENDING</span>
            <span><span style={{ display: 'inline-block', width: 10, height: 10, border: `1px dashed ${C.slate300}`, verticalAlign: 'middle', marginRight: 6 }} />OPEN</span>
          </div>
        </div>
      </div>
    </section>
  );
}
