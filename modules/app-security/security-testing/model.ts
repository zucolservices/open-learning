/** Placing test types in a pipeline, and which kinds of bug each one catches. */

export type Kind = "sast" | "sca" | "secret" | "dast" | "pentest";

export const KINDS: { id: Kind; name: string; what: string; when: string }[] = [
  {
    id: "secret",
    name: "Secret scanning",
    what: "Looks for passwords and keys committed to code.",
    when: "On every commit; block the push.",
  },
  {
    id: "sast",
    name: "SAST",
    what: "Reads your source code for risky patterns, without running it.",
    when: "In the editor and on every pull request.",
  },
  {
    id: "sca",
    name: "SCA",
    what: "Checks your open-source dependencies against vulnerability databases.",
    when: "On every build and on a schedule.",
  },
  {
    id: "dast",
    name: "DAST",
    what: "Attacks the running app from outside, as an attacker would.",
    when: "Against a test deployment, nightly.",
  },
  {
    id: "pentest",
    name: "Pen test / bug bounty",
    what: "People probe for weaknesses tools miss, especially logic flaws.",
    when: "Periodically, and continuously via a bounty.",
  },
];

export interface Bug {
  id: string;
  label: string;
  caughtBy: Kind[];
}

export const BUGS: Bug[] = [
  { id: "sqli", label: "A query built by pasting user input", caughtBy: ["sast", "dast"] },
  { id: "dep", label: "A dependency with a known critical flaw", caughtBy: ["sca"] },
  { id: "key", label: "An API key hard-coded in a config file", caughtBy: ["secret"] },
  { id: "header", label: "A missing security header on the live site", caughtBy: ["dast"] },
  { id: "logic", label: "Any user can approve their own refund", caughtBy: ["pentest"] },
  { id: "xss", label: "Unescaped output in a template", caughtBy: ["sast", "dast"] },
];

export const FACTS: [string, string][] = [
  [
    "No tool finds everything",
    "Each kind catches different bugs; static tools also raise false alarms, so teams layer several and tune them.",
  ],
  [
    "Shift left, but stay fast",
    "Run quick checks in the editor and on every pull request; keep deeper scans on a schedule, so alerts don't get ignored.",
  ],
  [
    "People find logic flaws",
    "A penetration test hunts within an agreed scope; a red team also tests whether defenders notice; bug bounties pay outside researchers for valid reports.",
  ],
  [
    "AI code isn't secure by default",
    "Studies from 2022 to 2026 found roughly 40–45% of AI-generated code failed security checks. Review and scan it like any other code.",
  ],
  [
    "Tools are targets too",
    "A scanner is a dependency; in 2026 one popular scanner's release was briefly trojanised. Pin your pipeline tools to exact versions.",
  ],
];
