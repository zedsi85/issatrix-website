import { C, FONT_DISPLAY, FONT_SANS, FONT_MONO } from './Primitives.jsx';
import { PageSectionHeader, HairlineGrid } from './PageBlocks.jsx';

export function DocsQuickstarts() {
  const audiences = [
    {
      role: 'ISSUER',
      title: 'For issuers',
      body: 'Stand up a tokenization program from structuring through redemption. Configure lifecycle stages, transfer controls, and reporting.',
      items: ['Quickstart: launch your first program', 'Configure transfer controls', 'Define redemption windows', 'Treasury operations'],
    },
    {
      role: 'COMPLIANCE',
      title: 'For compliance officers',
      body: 'Onboard investors, configure rules, and retrieve audit-grade event logs. Set per-program jurisdiction policies.',
      items: ['Onboarding configuration', 'Jurisdictional rule packs', 'Audit log retrieval', 'Continuous re-screening'],
    },
    {
      role: 'ENGINEER',
      title: 'For engineering teams',
      body: 'Integrate Issatrix into your stack with the issuer SDK, the on-chain registry, and the webhook event feed.',
      items: ['SDK: TypeScript / Python', 'On-chain registry contracts', 'Webhook event feed', 'Multi-chain deployment'],
    },
  ];
  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="01 ·"
          eyebrow="QUICKSTARTS"
          title="Pick the path that matches the role."
          body="Documentation is organised by who's reading it. Each path starts with a one-hour quickstart and ends with the reference material for that surface."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderTop: `1px solid ${C.slate200}` }}>
          {audiences.map((a, i) => (
            <div key={a.role} style={{
              padding: '32px 24px',
              paddingLeft: i === 0 ? 0 : 24,
              borderRight: i < 2 ? `1px solid ${C.slate200}` : 'none',
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.1em' }}>● {a.role}</div>
              <h3 style={{
                fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 28, lineHeight: 1.1,
                color: C.ink, margin: '14px 0 10px', letterSpacing: '-0.01em',
              }}>{a.title}</h3>
              <p style={{ fontFamily: FONT_SANS, fontSize: 14, lineHeight: 1.6, color: C.slate500, margin: 0 }}>{a.body}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {a.items.map(it => (
                  <li key={it} style={{ fontFamily: FONT_SANS, fontSize: 13, color: C.ink, display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <span style={{ color: C.aqua600, fontFamily: FONT_MONO }}>↗</span>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DocsArchitecture() {
  const layers = [
    { coord: '02 · 01', t: 'Issuance engine',      b: 'Programmatic minting, supply management, and lifecycle-stage enforcement.' },
    { coord: '02 · 02', t: 'Compliance layer',      b: 'KYC / AML providers, jurisdiction rules, allowlist registry, and re-screening.' },
    { coord: '02 · 03', t: 'Transfer control',      b: 'On-chain enforcement of rules R-01..R-08 (see Compliance).' },
    { coord: '02 · 04', t: 'On-chain registry',     b: 'Holder records, attestations, and audit-grade lifecycle event log.' },
    { coord: '02 · 05', t: 'Multi-chain bridge',    b: 'State mirroring across Ethereum, Base, Polygon, and Avalanche.' },
    { coord: '02 · 06', t: 'Issuer SDK',            b: 'TypeScript and Python clients for engineering teams.' },
    { coord: '02 · 07', t: 'Webhook event feed',    b: 'Real-time stream of lifecycle events with cryptographic signatures.' },
    { coord: '02 · 08', t: 'Admin console',         b: 'Web-based dashboards for treasury, compliance, and reporting operators.' },
  ];
  return (
    <section style={{ background: C.bone, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="02 ·"
          eyebrow="ARCHITECTURE"
          title="Eight modules. One issuance matrix."
          body="Issatrix is a small set of well-defined modules. Each is independently testable, independently deployed, and reusable across programs."
        />
        <HairlineGrid items={layers} columns={4} />
      </div>
    </section>
  );
}

export function DocsApiReference() {
  const endpoints = [
    { method: 'POST', path: '/v1/programs',              purpose: 'Create a new issuance program (matrix root).' },
    { method: 'GET',  path: '/v1/programs/{id}',         purpose: 'Retrieve a program and its current lifecycle stage.' },
    { method: 'POST', path: '/v1/programs/{id}/issuance',purpose: 'Issue (mint) units against a verified reserve block.' },
    { method: 'POST', path: '/v1/programs/{id}/holders', purpose: 'Onboard a new holder after KYC, AML, and accreditation.' },
    { method: 'POST', path: '/v1/transfers',             purpose: 'Submit a transfer for rule evaluation and execution.' },
    { method: 'POST', path: '/v1/redemptions',           purpose: 'Queue a redemption request for the next window.' },
    { method: 'GET',  path: '/v1/audit/events',          purpose: 'Stream or page the audit-grade lifecycle event log.' },
    { method: 'POST', path: '/v1/webhooks',              purpose: 'Subscribe to event types with a destination and signature key.' },
  ];
  const methodColor = { POST: C.aqua700, GET: C.verified };
  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="03 ·"
          eyebrow="API REFERENCE"
          title="A small surface, deliberately."
          body="The Issatrix API exposes the lifecycle, not the implementation. Every program, holder, transfer, and audit event is a first-class resource."
        />
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FONT_MONO, fontSize: 13 }}>
          <thead>
            <tr style={{ borderTop: `1px solid ${C.slate200}`, borderBottom: `1px solid ${C.slate200}` }}>
              {['Method', 'Endpoint', 'Purpose'].map(h => (
                <th key={h} style={{
                  textAlign: 'left', padding: '12px 16px',
                  fontFamily: FONT_SANS, fontWeight: 500, fontSize: 11,
                  textTransform: 'uppercase', letterSpacing: '0.12em', color: C.slate400,
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {endpoints.map((e, i) => (
              <tr key={e.path} style={{ borderBottom: i < endpoints.length - 1 ? `1px solid ${C.slate100}` : 'none' }}>
                <td style={{ padding: '14px 16px', width: 100 }}>
                  <span style={{
                    fontFamily: FONT_MONO, fontSize: 11, padding: '3px 8px',
                    borderRadius: 2, background: C.paper2, color: methodColor[e.method] || C.slate500,
                    letterSpacing: '0.06em',
                  }}>{e.method}</span>
                </td>
                <td style={{ padding: '14px 16px', color: C.ink }}>{e.path}</td>
                <td style={{ padding: '14px 16px', fontFamily: FONT_SANS, fontSize: 13, color: C.slate500 }}>{e.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 16, fontFamily: FONT_MONO, fontSize: 11, color: C.slate400, letterSpacing: '0.04em' }}>
          BASE URL · https://api.issatrix.io · AUTH · BEARER · RATE LIMIT · 600/MIN
        </div>
      </div>
    </section>
  );
}

export function DocsCodeSample() {
  const snippet = `import { Issatrix } from '@issatrix/sdk';

const client = new Issatrix({ apiKey: process.env.ISSATRIX_KEY });

// 1. Create a program (a row in the matrix)
const program = await client.programs.create({
  name:       'AquaIndex Reserve A',
  symbol:     'AQX-A',
  chain:      'ethereum-l1',
  regime:     'reg-d-506c',
  supply:     12_480_000,
  transfer:   'allowlist',
  redemption: 'quarterly',
});

// 2. Onboard a holder
await client.holders.create({
  programId: program.id,
  wallet:    '0x7a3c...ae04',
  region:    'EU',
  kyc:       { provider: 'sumsub', referenceId: 'sub_42' },
});

// 3. Submit a transfer (rules evaluated on-chain)
const transfer = await client.transfers.submit({
  programId: program.id,
  from:      '0x7a3c...ae04',
  to:        '0x9F2c...1102',
  units:     1_200,
});

console.log(transfer.status); // 'settled' | 'rejected:r-04' | ...`;
  return (
    <section style={{ background: C.bone, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="04 ·"
          eyebrow="CODE SAMPLE"
          title="Issue, onboard, and transfer in 30 lines."
          body="The SDK mirrors the API surface 1:1. The full lifecycle — program creation, onboarding, transfer — is callable from any backend."
        />
        <div style={{
          background: C.ink, color: C.paper,
          border: `1px solid ${C.slate600}`, borderRadius: 2,
          padding: 28, fontFamily: FONT_MONO, fontSize: 13, lineHeight: 1.7,
          whiteSpace: 'pre', overflowX: 'auto',
        }}>
          <div style={{ marginBottom: 16, fontFamily: FONT_SANS, fontSize: 11, color: 'rgba(245,242,235,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            ▦ &nbsp; typescript &nbsp; · &nbsp; @issatrix/sdk
          </div>
          {snippet}
        </div>
      </div>
    </section>
  );
}

export function DocsResources() {
  const cards = [
    { eyebrow: 'STATUS',    t: 'Platform status',   d: 'Live status across all chains and modules.', href: '#' },
    { eyebrow: 'SECURITY',  t: 'Security & audits', d: 'Published audits, disclosure policy, and bug-bounty program.', href: '#' },
    { eyebrow: 'CHANGELOG', t: 'Release notes',     d: 'API and module changelog by version, with migration guides.', href: '#' },
    { eyebrow: 'SUPPORT',   t: 'Issuer support',    d: 'Dedicated support channels for active issuance programs.', href: '#' },
  ];
  return (
    <section style={{ background: C.paper, borderTop: `1px solid ${C.slate200}` }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '96px 32px' }}>
        <PageSectionHeader
          coord="05 ·"
          eyebrow="RESOURCES"
          title="The rest of the documentation surface."
          body="Outside of the four primary docs paths, these are the most-used resources for live programs."
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {cards.map(c => (
            <a key={c.eyebrow} href={c.href} style={{
              border: `1px solid ${C.slate200}`, background: C.bone, padding: '20px 18px',
              borderRadius: 2, textDecoration: 'none', color: 'inherit',
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: C.slate400, letterSpacing: '0.1em' }}>{c.eyebrow}</div>
              <h4 style={{ fontFamily: FONT_SANS, fontWeight: 500, fontSize: 16, color: C.ink, margin: '10px 0 6px' }}>{c.t}</h4>
              <p style={{ fontFamily: FONT_SANS, fontSize: 13, lineHeight: 1.55, color: C.slate500, margin: 0 }}>{c.d}</p>
              <div style={{ marginTop: 14, fontFamily: FONT_SANS, fontSize: 12, color: C.aqua700, fontWeight: 500 }}>Open →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
