/**
 * Capstone: a made-up learning app for school students (PadhaiPal) made DPDP-ready before May 2027.
 * Findings reuse facts checked for modules 1–21. Fixes are judged right or wrong; nothing is scored.
 */

export interface Finding {
  id: string;
  area: string;
  problem: string;
  good: string;
  bad: string;
  why: string;
  law: string;
}

export const FINDINGS: Finding[] = [
  {
    id: "map",
    area: "Data map",
    problem:
      "Nobody can list where student data lives: app database, analytics SDK, video host, AI tutor vendor, backups.",
    good: "Build a data map: each kind of data, every system and vendor, purpose and retention",
    bad: "Write a privacy policy first and map later",
    why: "Every other duty depends on knowing where the data is.",
    law: "s.8, Rule 6",
  },
  {
    id: "notice",
    area: "Notice",
    problem: "The only notice is a 9-page legal privacy policy, in English.",
    good: "A standalone, itemised notice with purposes and links to withdraw, use rights and complain, in a choice of languages",
    bad: "Add a summary at the top of the same policy",
    why: "The notice must stand on its own, itemise data, and offer the Eighth Schedule languages.",
    law: "s.5, Rule 3",
  },
  {
    id: "consent",
    area: "Consent",
    problem: "Sign-up has one pre-ticked box covering lessons, analytics and marketing.",
    good: "Separate empty boxes per purpose; marketing optional; one-tap withdrawal",
    bad: "Keep one box but untick it by default",
    why: "Consent must be specific and given by a clear action, and withdrawal as easy as giving it.",
    law: "s.6",
  },
  {
    id: "age",
    area: "Age",
    problem: "The app doesn't know which users are under 18.",
    good: "Ask for date of birth at sign-up, collecting nothing more than needed",
    bad: "Assume everyone is an adult unless a parent complains",
    why: "Checking age is an exempt purpose; without it, child rules can't be followed.",
    law: "s.9, Fourth Schedule",
  },
  {
    id: "parent",
    area: "Parental consent",
    problem: "A child's account is created first; a parent email is 'requested' later.",
    good: "Verify the parent is an identifiable adult before creating the child's account",
    bad: "Send the parent an email and carry on if they don't object",
    why: "Verifiable parental consent comes before processing a child's data.",
    law: "s.9(1), Rule 10",
  },
  {
    id: "recs",
    area: "Children's features",
    problem:
      "'Students like you also watched' recommendations and engagement tracking run for all users.",
    good: "Switch to curriculum- and grade-based recommendations for under-18s",
    bad: "Keep them, since parents consented",
    why: "Behavioural monitoring of children is barred even with parental consent; the school exemption is unlikely to cover a private app.",
    law: "s.9(3)",
  },
  {
    id: "streaks",
    area: "Well-being",
    problem: "Streak counters send 'You let your class down' messages after a missed day.",
    good: "Remove shaming streaks and guilt messages for children",
    bad: "Let parents turn the messages off",
    why: "Processing likely to harm a child's well-being is never exempt.",
    law: "s.9(2)",
  },
  {
    id: "retain",
    area: "Retention",
    problem: "Old class recordings and inactive accounts are kept forever.",
    good: "Set purpose-end triggers and automatic erasure, at vendors too, keeping only required logs",
    bad: "Delete everything older than a week, logs included",
    why: "Erase when the purpose is served, but keep processing logs for a year.",
    law: "s.8(7), Rule 8(3)",
  },
  {
    id: "security",
    area: "Security",
    problem: "Student records sit unencrypted in object storage behind a shared admin password.",
    good: "Encrypt, give each admin their own login with MFA, log access and test backups",
    bad: "Rotate the shared password monthly",
    why: "Rule 6 sets minimum safeguards; failures can draw up to ₹250 crore.",
    law: "s.8(5), Rule 6",
  },
  {
    id: "vendors",
    area: "Processors",
    problem:
      "The video host and AI tutor vendor were signed up with a credit card; no contract terms.",
    good: "Contracts with security terms, breach notice to you, and erase-on-instruction",
    bad: "Rely on the vendors' good reputations",
    why: "Processors only under a valid contract with safeguards; you stay responsible.",
    law: "s.8(1)–(2), Rule 6(1)(f)",
  },
  {
    id: "rights",
    area: "Rights",
    problem: "There's no way to ask for access or erasure, and no named contact.",
    good: "Publish a request channel, the identifier you'll check, a contact, and a grievance period of at most 90 days",
    bad: "Tell users to email support",
    why: "Rule 14 requires publishing the means; grievances need an answer within the published period.",
    law: "ss.11–14, Rule 14",
  },
  {
    id: "breach",
    area: "Breach plan",
    problem: "The incident runbook only mentions CERT-In.",
    good: "Add notices to each affected student and parent, the Board's first notice, and the 72-hour report",
    bad: "Plan to tell the Board only if many students are affected",
    why: "Every breach must be notified; there's no size threshold.",
    law: "s.8(6), Rule 7",
  },
];

export interface DrillStep {
  id: string;
  q: string;
  options: { id: string; label: string; good: boolean; result: string }[];
}

export const DRILL: DrillStep[] = [
  {
    id: "who",
    q: "June 2027: the AI tutor vendor says some students' chat transcripts were exposed. Who must PadhaiPal tell?",
    options: [
      {
        id: "all",
        label: "The Board, CERT-In, and each affected student, with parents for under-18s",
        good: true,
        result:
          "For a child, the Data Principal includes the parent. Tell them directly, through registered channels.",
      },
      {
        id: "vendor",
        label: "Nobody: it was the vendor's breach",
        good: false,
        result: "PadhaiPal is the fiduciary; it answers for its processor and must notify.",
      },
    ],
  },
  {
    id: "when",
    q: "How fast?",
    options: [
      {
        id: "fast",
        label:
          "CERT-In within 6 hours; Board and families without delay; detailed Board report within 72 hours",
        good: true,
        result: "Two regimes, two clocks, started the moment PadhaiPal knew.",
      },
      {
        id: "slow",
        label: "One combined report after the investigation ends",
        good: false,
        result: "Both regimes want early notice; investigations continue alongside.",
      },
    ],
  },
  {
    id: "fix",
    q: "What does the Board weigh in PadhaiPal's favour?",
    options: [
      {
        id: "mitigate",
        label: "Fast, effective mitigation and honest notices",
        good: true,
        result: "Mitigation is one of the factors the Board must consider.",
      },
      {
        id: "small",
        label: "That only children's data was involved",
        good: false,
        result: "Children's data makes it more serious, not less.",
      },
    ],
  },
];

export const TODAY: [string, string][] = [
  ["CERT-In Directions", "Report listed cyber incidents within 6 hours; keep 180 days of logs."],
  [
    "IT Act s.43A and SPDI Rules",
    "Reasonable security practices for sensitive data, until May 2027.",
  ],
  [
    "Consumer law",
    "In June 2026 CCPA fined ed-tech company PhysicsWallah ₹5 lakh for a pre-ticked donation and 'free' courses gated behind phone and email.",
  ],
  ["Consent managers", "Can register from November 2026."],
  [
    "Watch",
    "A large children's app could later be named a Significant Data Fiduciary; none has been.",
  ],
];

export const CHECKLIST: [string, string[]][] = [
  ["Big picture", ["Know what applies and when", "Map every copy of personal data"]],
  [
    "Lawful processing",
    [
      "Standalone, itemised notices",
      "Specific consent with easy withdrawal",
      "A ground for every purpose",
    ],
  ],
  [
    "Fiduciary duties",
    [
      "Retention and erasure, automated",
      "Rule 6 safeguards",
      "Processor contracts",
      "A breach plan for both clocks",
    ],
  ],
  ["Rights", ["A published request channel", "Grievances answered within 90 days"]],
  [
    "Special cases",
    [
      "Children: verify parents, no tracking or targeted ads",
      "Check transfers against sector rules",
    ],
  ],
  [
    "Enforcement and engineering",
    ["Mitigate fast", "Purpose tags, consent ledger, deletion fan-out"],
  ],
];
