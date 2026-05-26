const Anthropic = require('@anthropic-ai/sdk');

const NARRATIVE_SYSTEM_PROMPT = `You are a senior tokenization consultant at Issatrix preparing professional narrative content for a Tokenization Structuring Book — an institutional consulting document.

Using the provided Tokenization Brief JSON, generate polished, professional narrative text for each document section.

TONE RULES:
- Institutional consulting-report style. Third person throughout.
- Conditional language: "may", "could", "is proposed", "subject to", "depending on regulatory review"
- Never guarantee returns, liquidity, or compliance outcomes
- Flag areas requiring independent legal/regulatory review
- Do NOT write: "guaranteed", "risk-free", "fully compliant", "will not be a security", "guaranteed yield"
- Suitable for executives, legal advisors, compliance teams, and institutional investors

Return ONLY valid JSON, no markdown, no code blocks. All fields are required:

{
  "executiveSummary": "3-4 paragraph narrative summarizing the project, proposed structure, key opportunity, and primary open questions",
  "tokenizationThesis": "2-3 paragraphs explaining why this asset type may be well-suited to tokenization and what structural benefits the issuance matrix model may offer",
  "issuanceMatrixExplanation": "2 paragraphs explaining how this specific asset translates into a structured digital ownership matrix",
  "complianceOverview": "2-3 paragraphs identifying key compliance and regulatory areas that require independent legal review",
  "defiConsiderations": "2 paragraphs on potential future DeFi and secondary liquidity considerations with appropriate disclaimers",
  "suggestedNextSteps": [
    { "phase": "Phase 1 — Structuring Review", "items": ["action tailored to this project", "..."] },
    { "phase": "Phase 2 — Legal and Compliance Review", "items": ["..."] },
    { "phase": "Phase 3 — Technical Design", "items": ["..."] },
    { "phase": "Phase 4 — Pre-Issuance Preparation", "items": ["..."] },
    { "phase": "Phase 5 — Launch Readiness", "items": ["..."] }
  ],
  "cautionPoints": ["specific caution relevant to this project", "..."],
  "launchReadinessExplanation": "1-2 paragraphs explaining current readiness status and what must be completed to advance"
}`;

function extractJSON(text) {
  try { return JSON.parse(text); } catch {}
  const mdMatch = text.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
  if (mdMatch) { try { return JSON.parse(mdMatch[1]); } catch {} }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) { try { return JSON.parse(text.slice(start, end + 1)); } catch {} }
  throw new Error('Could not extract valid JSON from narrative response');
}

async function generateNarrative(brief) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackNarrative(brief);
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: NARRATIVE_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Generate the Tokenization Structuring Book narrative for this brief:\n\n${JSON.stringify(brief, null, 2)}`,
      }],
    });
    return extractJSON(response.content[0].text);
  } catch (err) {
    console.error('Narrative generation failed, using fallback:', err.message);
    return buildFallbackNarrative(brief);
  }
}

function buildFallbackNarrative(brief) {
  const ao = brief.asset_overview || {};
  const tm = brief.tokenization_model || {};
  const iam = brief.investor_access_model || {};
  const tc = brief.technical_configuration || {};
  const score = brief.readiness_score || 'draft';
  const assetName = ao.assetName || 'This asset';
  const assetType = ao.assetType || 'real-world asset';
  const issuer = ao.ownerIssuer || 'the issuer';
  const location = ao.location || 'an undisclosed jurisdiction';
  const value = ao.estimatedValue || 'under review';
  const tokenPurpose = tm.tokenPurpose || 'structured token issuance';
  const investorType = iam.investorType || 'qualified investors';
  const chains = (tc.chainSelection || []).join(', ') || 'a selected blockchain network';
  const scoreLabel = score.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    executiveSummary: `${assetName} is a ${assetType} located in ${location}, proposed for tokenization by ${issuer}. The estimated asset value is ${value}. This Tokenization Structuring Book represents the initial framework for converting this real-world asset into a programmable digital ownership structure on the Issatrix platform.\n\nThe proposed tokenization model involves ${tokenPurpose}, targeting ${investorType}. The structure outlined in this document requires further validation by legal, compliance, and technical advisors before any issuance proceeds. This document is a structuring reference, not a legal or regulatory assessment.\n\nAll assumptions, proposed structures, and technical configurations must be independently reviewed and validated by qualified professionals. The Issatrix team is available to support the transition from structuring to technical and legal review phases.`,

    tokenizationThesis: `${assetType} assets may be well-suited to tokenization where the objective is to create structured, programmable ownership units representing verifiable interests in the underlying asset. By converting the asset into an Issatrix issuance matrix, the issuer may be able to manage investor onboarding, transfer restrictions, compliance checks, and lifecycle events in a more transparent and auditable manner.\n\nTokenization may also facilitate fractional representation of the asset, enabling investor access at potentially lower thresholds than traditional structures permit. The suitability of tokenization for this specific asset must be validated through independent legal and financial analysis, with particular attention to applicable securities regulations and investor qualification requirements.`,

    issuanceMatrixExplanation: `The Issatrix issuance matrix is a structured digital ownership model in which a real-world asset is decomposed into programmable ownership cells. Each cell represents a verified investor position and contains identity data, token balance, KYC status, transfer eligibility, and lifecycle state. The matrix provides a single enforceable ownership record for the asset, observable on-chain and manageable through the Issatrix platform.\n\nFor ${assetName}, the matrix would be configured to reflect the proposed tokenization model, investor access rules, and transfer restrictions defined in this document. Each ownership cell would represent an investor's verified interest in the asset, subject to the compliance checks and lifecycle controls configured at the time of issuance.`,

    complianceOverview: `The tokenization of ${assetType} assets raises several legal and regulatory considerations that must be addressed by qualified legal counsel before any issuance proceeds. The proposed structure — involving ${tokenPurpose} targeting ${investorType} — may be subject to securities regulation, investor eligibility requirements, and transfer restriction obligations depending on the applicable jurisdiction.\n\nKey areas for legal review include token classification under applicable securities law, investor accreditation or qualification requirements, transfer restriction enforcement mechanisms, KYC and AML compliance obligations, and any jurisdiction-specific licensing or registration requirements. This document does not constitute legal advice.\n\nAll compliance assumptions should be treated as structuring hypotheses pending formal legal review. The Issatrix platform provides the technical infrastructure to enforce compliance rules once legally defined, but the substance of those rules must be determined by qualified counsel.`,

    defiConsiderations: `Tokenization on ${chains} may prepare the ownership structure for potential future integration with DeFi protocols or controlled secondary liquidity mechanisms, subject to applicable regulatory permissions and investor eligibility restrictions. Tokenized interests may, in appropriate regulatory contexts, be eligible for use in permissioned lending, borrowing, or collateralization protocols.\n\nActual liquidity for tokenized interests depends on market demand, regulatory approvals, exchange or protocol support, and the specific design of the token's transfer controls. Tokenization does not guarantee liquidity, and investors should not assume that a secondary market will exist or be accessible. Any DeFi integration or secondary market functionality must be reviewed for compliance before implementation.`,

    suggestedNextSteps: [
      {
        phase: 'Phase 1 — Structuring Review',
        items: [
          'Validate the proposed tokenization model with the Issatrix structuring team',
          'Confirm the legal structure of the issuing entity (SPV, trust, or direct ownership)',
          'Define the rights represented by each token unit with precision',
          'Confirm the target investor category and access model',
          `Review applicable regulations in ${location}`,
        ],
      },
      {
        phase: 'Phase 2 — Legal and Compliance Review',
        items: [
          'Engage securities law counsel to assess token classification',
          'Obtain a legal opinion on investor eligibility and accreditation requirements',
          'Define and validate transfer restrictions and lock-up periods',
          'Confirm KYC/AML provider requirements',
          'Review marketing restrictions and required investor disclosures',
          'Assess tax treatment of tokenized interests',
        ],
      },
      {
        phase: 'Phase 3 — Technical Design',
        items: [
          'Select and configure the smart contract standard',
          `Configure deployment to ${chains}`,
          'Define wallet whitelisting and transfer control logic',
          'Configure admin roles: issuer, compliance officer, transfer agent',
          'Integrate KYC provider for investor onboarding',
          'Define issuance matrix cell structure and metadata schema',
        ],
      },
      {
        phase: 'Phase 4 — Pre-Issuance Preparation',
        items: [
          'Finalize and submit all required documents listed in this brief',
          'Configure the Issatrix platform for this issuance program',
          'Conduct test issuance and compliance validation',
          'Prepare investor-facing materials and subscription documentation',
          'Complete smart contract security review',
          'Obtain final approval from legal and compliance advisors',
        ],
      },
      {
        phase: 'Phase 5 — Launch Readiness',
        items: [
          'Receive final sign-off from legal counsel and compliance team',
          'Deploy smart contracts to the selected blockchain network',
          'Onboard initial investors with KYC verification',
          'Activate transfer controls and monitoring dashboard',
          'Issue tokens against verified investor positions',
          'Begin post-issuance reporting and lifecycle monitoring',
        ],
      },
    ],

    cautionPoints: [
      'Do not market this token as offering guaranteed returns or guaranteed liquidity',
      'Do not proceed with issuance until a formal legal opinion is obtained on token classification',
      'Confirm asset ownership and any encumbrances with independent legal counsel before issuance',
      'Validate all investor eligibility rules with qualified regulatory counsel',
      'Do not represent secondary market availability before exchange or protocol arrangements are confirmed',
      'Transfer restrictions must be validated by legal counsel before being relied upon',
      `The jurisdiction of ${location} may impose specific registration, licensing, or marketing restrictions — confirm with local counsel`,
      'All tokenization assumptions in this document are subject to change following legal and technical review',
    ],

    launchReadinessExplanation: `The current readiness assessment for this project is: ${scoreLabel}. This reflects the completion of the initial structuring phase through the Issatrix Asset Structuring Agent and represents the project's current position in the issuance lifecycle.\n\nTo advance to the next readiness stage, the outstanding items identified in the Required Documents and Risks sections of this document must be addressed. Legal review of the token structure, investor access model, and transfer restrictions is a prerequisite for progressing beyond the Structuring stage. The Issatrix team is available to support the transition to the compliance and technical review phases.`,
  };
}

module.exports = { generateNarrative };
