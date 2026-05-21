import { PageHero, PageCTA } from '../components/marketing/PageBlocks.jsx';
import { CompliancePillars, OnboardingFlow, TransferRules, AuditTrail } from '../components/marketing/ComplianceSections.jsx';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';

export default function CompliancePage() {
  return (
    <>
      <PageHero
        coord="▦ MX · 02"
        eyebrow="COMPLIANCE"
        title="Compliance is not a layer. It is the issuance."
        body="Every transfer, redemption, and onboarding event on Issatrix passes through a consistent set of on-chain compliance checks. There is no off-chain workaround — the matrix enforces the rules."
        primaryCta={{ label: 'Get in touch →', href: CONTACT_URL }}
        secondaryCta={{ label: 'View transfer rules', href: '/compliance#transfer-rules' }}
      />
      <CompliancePillars />
      <OnboardingFlow />
      <TransferRules />
      <AuditTrail />
      <PageCTA
        title="Compliance questions? Talk to the team."
        body="Issatrix is designed for regulated environments. If you have specific compliance requirements, the team can walk you through how the platform handles them."
      />
    </>
  );
}
