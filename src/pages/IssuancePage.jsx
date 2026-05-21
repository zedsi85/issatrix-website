import { PageHero, PageCTA } from '../components/marketing/PageBlocks.jsx';
import { IssuanceLifecycle, TokenStructuring, MultiChain, IssuanceMatrix } from '../components/marketing/IssuanceSections.jsx';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';

export default function IssuancePage() {
  return (
    <>
      <PageHero
        coord="▦ MX · 01"
        eyebrow="ISSUANCE"
        title="The infrastructure layer for programmatic asset issuance."
        body="Issatrix gives issuers a complete stack to structure, launch, and manage tokenization programs — from supply configuration through redemption. Every stage is observable, auditable, and enforceable on-chain."
        primaryCta={{ label: 'Get in touch →', href: CONTACT_URL }}
        secondaryCta={{ label: 'Read the docs', href: '/docs' }}
      />
      <IssuanceLifecycle />
      <TokenStructuring />
      <MultiChain />
      <IssuanceMatrix />
      <PageCTA
        title="Ready to launch an issuance program?"
        body="Speak with the Issatrix team about structuring your asset and launching on the matrix."
      />
    </>
  );
}
