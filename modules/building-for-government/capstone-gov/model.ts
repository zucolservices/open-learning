/** Kalpanagar's state scholarship portal, from tender to deadline day. All details are made up. */

export interface Choice {
  id: string;
  title: string;
  options: { id: string; label: string; ok: boolean; outcome: string }[];
}

export const DESIGN: Choice[] = [
  {
    id: "buy",
    title: "Buying the build",
    options: [
      {
        id: "l1",
        label: "Lowest price wins, fixed scope, one launch date",
        ok: false,
        outcome: "Cheapest on paper; all the risk lands on launch day.",
      },
      {
        id: "fair",
        label:
          "An open tender judged on quality as well as cost, within the rules, with staged releases",
        ok: true,
        outcome: "A capable team, and problems found before the deadline rush.",
      },
    ],
  },
  {
    id: "contract",
    title: "The contract",
    options: [
      {
        id: "own",
        label: "The state owns the code and data; service levels with credits; an exit plan",
        ok: true,
        outcome: "The state can change, measure and, if needed, leave.",
      },
      {
        id: "vendor",
        label: "The vendor keeps the code and licenses it to the state",
        ok: false,
        outcome: "Every change, and every future vendor, goes through one company.",
      },
    ],
  },
  {
    id: "identity",
    title: "Identity and documents",
    options: [
      {
        id: "reuse",
        label:
          "Use students' national scholarship registration and fetch documents from DigiLocker",
        ok: true,
        outcome: "No new identity system, no photocopies, fewer forgeries.",
      },
      {
        id: "own",
        label: "Build a new login and ask for scanned certificates",
        ok: false,
        outcome: "Another password to forget, and scans nobody can verify.",
      },
    ],
  },
  {
    id: "hosting",
    title: "Hosting students' data",
    options: [
      {
        id: "abroad",
        label: "The cheapest commercial cloud, wherever it is",
        ok: false,
        outcome:
          "Government data stays in India, and sensitive personal data belongs on government clouds under the 2026 framework.",
      },
      {
        id: "gov",
        label: "A State Data Centre or NIC cloud, with recovery in another region",
        ok: true,
        outcome: "Within the rules, and recoverable if one site fails.",
      },
    ],
  },
];

export const AUDIT: { id: string; problem: string; fix: string }[] = [
  {
    id: "a11y",
    problem: "Form fields have no labels; a screen reader announces “edit text”.",
    fix: "Label every field (WCAG, IS 17802)",
  },
  {
    id: "lang",
    problem: "English only.",
    fix: "Hindi, the state language and English, in Unicode",
  },
  {
    id: "weight",
    problem: "The application page weighs 2.7 MB.",
    fix: "Cut it to a light page that works on 2G",
  },
  { id: "save", problem: "Progress is lost if the session expires.", fix: "Save and resume" },
  {
    id: "income",
    problem: "It fetches each family's full income record.",
    fix: "Ask the revenue department only “below the limit?”",
  },
  {
    id: "logs",
    problem: "Logs stay on each server for a week.",
    fix: "Keep logs 180 days, apart from the servers, with synced clocks",
  },
];

export const LAUNCH: Choice[] = [
  {
    id: "surge",
    title: "Deadline week: applications triple",
    options: [
      {
        id: "extend",
        label: "Hope it holds, and extend the deadline if it doesn't",
        ok: false,
        outcome: "It doesn't hold; the extension moves the crush, and trust drops.",
      },
      {
        id: "plan",
        label: "Load-tested capacity, cached pages, a fair queue and SMS reminders weeks earlier",
        ok: true,
        outcome: "The busiest day passes with short waits and no errors.",
      },
    ],
  },
  {
    id: "payments",
    title: "Hundreds of approved scholarships bounce",
    options: [
      {
        id: "blame",
        label: "Ask students to sort it out with their banks",
        ok: false,
        outcome: "Grievances pile up; many students never get paid.",
      },
      {
        id: "show",
        label:
          "Show students which bank account will be paid before they submit, and re-run fixed payments",
        ok: true,
        outcome: "Most accounts are corrected before money is sent.",
      },
    ],
  },
  {
    id: "fraud",
    title: "Applications arrive from an institution nobody can find",
    options: [
      {
        id: "verify",
        label: "Verify institutions before they can join, and check applications at each level",
        ok: true,
        outcome: "Fake institutions are stopped before money goes out.",
      },
      {
        id: "trust",
        label: "Pay first, audit next year",
        ok: false,
        outcome:
          "Nationally, a 2023 CBI case alleged 830 fake or partly fake institutions drew about ₹144 crore in minority scholarships.",
      },
    ],
  },
];
