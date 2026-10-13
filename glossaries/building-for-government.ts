import type { GlossaryEntry } from "./types";

/** Building for Government track glossary. `module` slugs refer to this track. */
export const govTrack = {
  "common-services-centre": {
    term: "Common Services Centre (CSC)",
    definition:
      "A local centre, run by a village-level entrepreneur, where people can use hundreds of government and other services with an operator's help. India had about 5.3 lakh in mid-2026.",
    module: "gov-is-different",
  },
  "assisted-access": {
    term: "Assisted access",
    definition:
      "Using a digital service through a trained helper, such as a service-centre operator, rather than on your own device. Government services must work well for helpers as well as for citizens.",
    module: "gov-is-different",
  },
  "digital-divide": {
    term: "Digital divide",
    definition:
      "The gap between people who can easily use digital services and those who can't, because of devices, connectivity, language, literacy, disability or cost.",
    module: "gov-is-different",
  },
  "digital-public-infrastructure": {
    term: "Digital public infrastructure (DPI)",
    definition:
      "Shared digital systems, such as identity, payments and consent-based data sharing, that public and private services build on, much as vehicles use shared roads.",
    module: "digital-public-infrastructure",
  },
  "india-stack": {
    term: "India Stack",
    definition:
      "An informal name for India's layers of digital public infrastructure: Aadhaar and eKYC for identity, UPI for payments, and DigiLocker and Account Aggregators for consent-based data sharing. Each has a different owner.",
    module: "digital-public-infrastructure",
  },
  "public-procurement": {
    term: "Public procurement",
    definition:
      "How government bodies buy goods, services and works with public money, under rules that require fair competition, openness and a record of why each choice was made.",
    module: "how-gov-buys",
  },
  gem: {
    term: "GeM (Government e-Marketplace)",
    definition:
      "India's online marketplace for government purchases, launched in 2016. Central bodies must buy goods and services listed on it through GeM.",
    module: "how-gov-buys",
  },
  qcbs: {
    term: "QCBS (quality and cost based selection)",
    definition:
      "A way to choose a winning bid that blends a technical-quality score with the price, instead of simply picking the cheapest qualified bid (L1).",
    module: "how-gov-buys",
  },
} satisfies Record<string, GlossaryEntry>;
