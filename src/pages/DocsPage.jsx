import { PageHero, PageCTA } from '../components/marketing/PageBlocks.jsx';
import { DocsQuickstarts, DocsArchitecture, DocsApiReference, DocsCodeSample, DocsResources } from '../components/marketing/DocsSections.jsx';

const CONTACT_URL = 'https://calendly.com/zedsi85/30min';

export default function DocsPage() {
  return (
    <>
      <PageHero
        coord="▦ MX · 04"
        eyebrow="DOCS"
        title="Documentation for issuers, compliance officers, and engineers."
        body="The Issatrix documentation surface covers all three audiences: how to structure and launch a program, how to configure compliance rules, and how to integrate via SDK and API."
        primaryCta={{ label: 'Get in touch →', href: CONTACT_URL }}
        secondaryCta={{ label: 'View API reference', href: '/docs#api-reference' }}
      />
      <DocsQuickstarts />
      <DocsArchitecture />
      <DocsApiReference />
      <DocsCodeSample />
      <DocsResources />
      <PageCTA
        title="Need help integrating Issatrix?"
        body="The team can onboard engineering, compliance, and treasury stakeholders. Get in touch to start the process."
      />
    </>
  );
}
