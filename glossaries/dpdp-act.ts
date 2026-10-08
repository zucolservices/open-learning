import type { GlossaryEntry } from "./types";

/** DPDP Act track glossary. `module` slugs refer to this track. */
export const dpdpAct = {
  "dpdp-act": {
    term: "DPDP Act",
    definition:
      "India's Digital Personal Data Protection Act, 2023: the law on how organisations may collect, use, store and share personal data held in digital form.",
    module: "why-dpdp",
  },
  "dpdp-rules": {
    term: "DPDP Rules",
    definition:
      "The Digital Personal Data Protection Rules, 2025: the detailed rules made under the Act that fill in how notices, consent managers, breach reports, retention and the Board work.",
    module: "why-dpdp",
  },
  "personal-data": {
    term: "Personal data",
    definition:
      "Any data about an individual who can be identified by or in relation to that data, such as a name, phone number, location or purchase history.",
    module: "why-dpdp",
  },
  "data-principal": {
    term: "Data Principal",
    definition:
      "The person the personal data is about. For a child, it includes their parent or lawful guardian.",
    module: "roles",
  },
  "data-fiduciary": {
    term: "Data Fiduciary",
    definition:
      "The person, company or body that decides why and how personal data is processed, alone or with others. Most duties under the Act fall on it.",
    module: "roles",
  },
  "data-processor": {
    term: "Data Processor",
    definition:
      "Anyone who processes personal data on behalf of a Data Fiduciary, such as a cloud host or an SMS vendor.",
    module: "roles",
  },
  "data-protection-board": {
    term: "Data Protection Board",
    definition:
      "The Data Protection Board of India: the body set up under the Act to handle breaches and complaints, and to impose penalties.",
    module: "roles",
  },
} satisfies Record<string, GlossaryEntry>;
