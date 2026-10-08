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
  "digital-personal-data": {
    term: "Digital personal data",
    definition:
      "Personal data in digital form. The Act covers it, including data first collected on paper and digitised later.",
    module: "scope",
  },
  "data-map": {
    term: "Data map",
    definition:
      "An inventory of the personal data an organisation holds: what it is, every system and vendor that holds a copy, why it's kept and for how long.",
    module: "data-mapping",
  },
  pseudonymisation: {
    term: "Pseudonymisation",
    definition:
      "Replacing identifiers with tokens or codes so data can't be linked to a person without extra information. Pseudonymised data is still personal data.",
    module: "data-mapping",
  },
  "dpdp-notice": {
    term: "Notice (DPDP)",
    definition:
      "What an organisation must tell a person before or with a request for consent: the personal data and purpose, how to withdraw and use their rights, and how to complain to the Data Protection Board.",
    module: "notice",
  },
  "eighth-schedule": {
    term: "Eighth Schedule",
    definition:
      "The part of India's Constitution listing 22 languages. People must be able to read a DPDP notice and consent request in English or any of them.",
    module: "notice",
  },
  consent: {
    term: "Consent (DPDP)",
    definition:
      "A person's agreement to processing that is free, specific, informed, unconditional and unambiguous, given by a clear affirmative action, and limited to the data needed for the stated purpose.",
    module: "consent",
  },
  "dark-pattern": {
    term: "Dark pattern",
    definition:
      "A design trick that nudges people into choices they didn't mean to make, such as pre-ticked boxes or a hidden 'no'. India's consumer regulator lists 13 kinds.",
    module: "consent",
  },
  withdrawal: {
    term: "Withdrawal of consent",
    definition:
      "Taking back consent you gave. Under the DPDP Act it must be as easy as giving it, and the organisation must then stop processing, and make its processors stop, within a reasonable time.",
    module: "withdrawal",
  },
  "legitimate-use": {
    term: "Legitimate use",
    definition:
      "One of the purposes in section 7 of the DPDP Act for which personal data may be processed without consent, such as data given for a specific purpose, legal duties, court orders, medical emergencies and employment.",
    module: "legitimate-uses",
  },
  "purpose-limitation": {
    term: "Purpose limitation",
    definition:
      "Using and keeping personal data only for the purpose it was collected for, and erasing it once that purpose is served, unless another law requires keeping it.",
    module: "purpose-retention",
  },
  "legal-hold": {
    term: "Legal hold",
    definition:
      "A requirement under another law, such as tax or anti-money-laundering rules, to keep certain records for a set period even after their original purpose has ended.",
    module: "purpose-retention",
  },
  "reasonable-security-safeguards": {
    term: "Reasonable security safeguards",
    definition:
      "The steps the DPDP Act requires to prevent personal data breaches. Rule 6 sets the minimum: encryption or masking, access control, logs and monitoring, backups, a year of logs, processor contracts and organisational measures.",
    module: "security-safeguards",
  },
  "data-processing-agreement": {
    term: "Data processing agreement",
    definition:
      "The contract between an organisation and a vendor that processes personal data for it, setting out security, breach notice, deletion and other duties.",
    module: "processors",
  },
  "cert-in": {
    term: "CERT-In",
    definition:
      "The Indian Computer Emergency Response Team, India's national agency for cyber incidents. Its 2022 directions require many incidents to be reported to it within six hours.",
    module: "breaches",
  },
  "right-to-access": {
    term: "Right to access",
    definition:
      "A Data Principal's right to a summary of their personal data and its processing, and the identities of every fiduciary and processor it was shared with.",
    module: "rights",
  },
  "right-to-erasure": {
    term: "Right to correction and erasure",
    definition:
      "A Data Principal's right to have personal data corrected, completed, updated or erased. Erasure can be refused only where the data is still needed for the purpose or a law requires keeping it.",
    module: "rights",
  },
  "grievance-redressal": {
    term: "Grievance redressal",
    definition:
      "The complaint process every Data Fiduciary must run. People must use it, and get an answer within the published period of at most 90 days, before complaining to the Data Protection Board.",
    module: "grievances-duties",
  },
  nomination: {
    term: "Nomination",
    definition:
      "Naming someone who can exercise your rights under the DPDP Act if you die or become unable to manage your affairs.",
    module: "grievances-duties",
  },
  tdsat: {
    term: "TDSAT",
    definition:
      "The Telecom Disputes Settlement and Appellate Tribunal, which hears appeals against the Data Protection Board's decisions.",
    module: "grievances-duties",
  },
} satisfies Record<string, GlossaryEntry>;
