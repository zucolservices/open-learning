/**
 * The road to the DPDP Act and what is in force on a given date. Dates follow the Gazette:
 * the Rules (G.S.R. 846(E)) and the Act's commencement notice (G.S.R. 843(E)) are dated
 * 13 November 2025, so the one-year and 18-month steps fall in November 2026 and May 2027.
 */

export interface Milestone {
  id: string;
  /** Month index from January 2017 (0) used to place it on the timeline. */
  at: number;
  date: string;
  title: string;
  body: string;
  /** Proposed only: shown dashed, never treated as law. */
  proposed?: boolean;
}

const m = (y: number, mo: number) => (y - 2017) * 12 + (mo - 1);

export const MILESTONES: Milestone[] = [
  {
    id: "puttaswamy",
    at: m(2017, 8),
    date: "24 Aug 2017",
    title: "Privacy is a fundamental right",
    body: "Nine Supreme Court judges agree, unanimously, that privacy is protected by Article 21 and Part III of the Constitution.",
  },
  {
    id: "srikrishna",
    at: m(2018, 7),
    date: "27 Jul 2018",
    title: "First draft bill",
    body: "The Justice B.N. Srikrishna committee hands over its report and a draft Personal Data Protection Bill.",
  },
  {
    id: "pdp2019",
    at: m(2019, 12),
    date: "11 Dec 2019",
    title: "A bill goes to Parliament",
    body: "The Personal Data Protection Bill, 2019 is introduced and sent to a Joint Parliamentary Committee.",
  },
  {
    id: "withdrawn",
    at: m(2022, 8),
    date: "3 Aug 2022",
    title: "Withdrawn, to start again",
    body: "After the committee proposes 81 amendments, the government withdraws the bill. A shorter draft follows in November 2022.",
  },
  {
    id: "act",
    at: m(2023, 8),
    date: "11 Aug 2023",
    title: "The DPDP Act becomes law",
    body: "Parliament passes the Digital Personal Data Protection Act; the President gives assent on 11 August 2023. It is Act No. 22 of 2023.",
  },
  {
    id: "rules",
    at: m(2025, 11),
    date: "13 Nov 2025",
    title: "The Rules, and the Board",
    body: "The DPDP Rules 2025 are published, the Data Protection Board is set up in law, and a timetable fixes when each part starts.",
  },
  {
    id: "proposal",
    at: m(2026, 1),
    date: "Jan 2026",
    title: "A shorter runway is proposed",
    body: "MeitY consults on cutting the 18-month runway to 12 months. As of October 2026 no change has been notified, so May 2027 stands.",
    proposed: true,
  },
  {
    id: "cm",
    at: m(2026, 11),
    date: "Nov 2026",
    title: "Consent managers can register",
    body: "One year after the Rules: the provisions on consent managers (Rule 4 and section 6(9)) start.",
  },
  {
    id: "core",
    at: m(2027, 5),
    date: "May 2027",
    title: "The core duties start",
    body: "18 months after the Rules: notice, consent, security, breach reporting, rights, children's data, penalties and the rest. The old IT Act section 43A falls away.",
  },
];

export const START = m(2023, 1);
export const END = m(2027, 12);

/** What can be in force, and from which month. */
export interface Part {
  id: string;
  label: string;
  from: number;
  /** For the old regime: in force until this month. */
  until?: number;
  old?: boolean;
}

export const PARTS: Part[] = [
  {
    id: "old",
    label: "IT Act s.43A and the 2011 SPDI Rules (the old regime)",
    from: START,
    until: m(2027, 5),
    old: true,
  },
  { id: "defs", label: "Definitions, and the Data Protection Board in law", from: m(2025, 11) },
  { id: "cm", label: "Consent manager registration", from: m(2026, 11) },
  { id: "notice", label: "Notice and consent duties", from: m(2027, 5) },
  { id: "security", label: "Security safeguards and breach reporting", from: m(2027, 5) },
  { id: "rights", label: "Rights of Data Principals", from: m(2027, 5) },
  { id: "children", label: "Children's data rules", from: m(2027, 5) },
  { id: "penalties", label: "Board inquiries and penalties", from: m(2027, 5) },
];

export function inForce(p: Part, at: number): boolean {
  return at >= p.from && (p.until === undefined || at < p.until);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function monthLabel(at: number): string {
  return `${MONTHS[at % 12]} ${2017 + Math.floor(at / 12)}`;
}

/** Today, for the "you are here" marker (October 2026). */
export const NOW = m(2026, 10);

export interface Incident {
  id: string;
  year: string;
  title: string;
  what: string;
  idea: string;
  ideaTerm: string;
}

export const INCIDENTS: Incident[] = [
  {
    id: "sita",
    year: "2021",
    title: "An airline's passenger data, via its IT provider",
    what: "In May 2021 Air India disclosed that an attack on SITA, the company running its passenger service system, had exposed details of about 4.5 million passengers: names, dates of birth, contact and passport details. Air India said it received the affected passengers' details from SITA weeks after the attack.",
    idea: "Under the DPDP Act the airline, as the fiduciary, stays responsible for what its processor does, and must tell every affected person.",
    ideaTerm: "data-processor",
  },
  {
    id: "aiims",
    year: "2022",
    title: "A hospital locked out of its own systems",
    what: "In November 2022 a ransomware attack hit AIIMS New Delhi. The government told Parliament that five servers were affected and about 1.3 TB of data was encrypted. The hospital ran key services by hand for days.",
    idea: "A breach isn't only a leak. Losing access to personal data counts too, because availability is part of the Act's definition.",
    ideaTerm: "personal-data-breach",
  },
  {
    id: "insurer",
    year: "2024",
    title: "Insurance customers' records offered online",
    what: "In September 2024 Star Health Insurance confirmed unauthorised access to some of its data after customer records were offered through chatbots on a messaging app. Reuters reported data on about 31 million customers, including some medical documents.",
    idea: "Health and claims data is exactly the kind of data where people need to be told quickly so they can protect themselves.",
    ideaTerm: "personal-data-breach",
  },
];
