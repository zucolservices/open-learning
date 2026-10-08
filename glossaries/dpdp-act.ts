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
  "fundamental-right": {
    term: "Fundamental right",
    definition:
      "A right guaranteed by Part III of India's Constitution that the state cannot take away by ordinary law. Since 2017, privacy is one of them.",
    module: "why-dpdp",
  },
  "spdi-rules": {
    term: "SPDI Rules",
    definition:
      "The IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, made under section 43A of the IT Act. They apply until the DPDP Act's core parts start in May 2027.",
    module: "why-dpdp",
  },
  "personal-data-breach": {
    term: "Personal data breach",
    definition:
      "Any unauthorised processing of personal data, or its accidental disclosure, acquisition, sharing, use, alteration, destruction or loss of access, that compromises its confidentiality, integrity or availability.",
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
  "consent-manager": {
    term: "Consent manager",
    definition:
      "A company registered with the Data Protection Board that gives people one place to give, manage, review and withdraw consent across organisations, through an interoperable platform.",
    module: "withdrawal",
  },
  "significant-data-fiduciary": {
    term: "Significant Data Fiduciary",
    definition:
      "A Data Fiduciary the government notifies as significant, based on factors such as the volume and sensitivity of its data and the risks involved. It has extra duties, such as a Data Protection Officer and yearly audits.",
    module: "significant-fiduciaries",
  },
} satisfies Record<string, GlossaryEntry>;
