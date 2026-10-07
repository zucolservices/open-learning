/** A stream of log lines during an attack: which to log, which should alert, and what not to record. */

export interface LogLine {
  id: string;
  text: string;
  kind: "normal" | "suspicious" | "secret";
  note: string;
}

export const STREAM: LogLine[] = [
  {
    id: "ok",
    text: "10:02 login ok user=asha ip=203.0.x",
    kind: "normal",
    note: "Routine. Log it, no alert.",
  },
  {
    id: "fail",
    text: "10:14 login FAILED user=admin (attempt 48 in 2 min)",
    kind: "suspicious",
    note: "A burst of failures: possible password guessing. Alert.",
  },
  {
    id: "pw",
    text: "10:14 DEBUG tried password 'Summer2026!'",
    kind: "secret",
    note: "Never log a password, even a wrong one. Remove this line.",
  },
  {
    id: "403",
    text: "10:15 403 user=ravi tried GET /admin/export",
    kind: "suspicious",
    note: "An access-control failure from a normal user: someone's probing. Alert.",
  },
  {
    id: "tok",
    text: "10:15 session=8f3c91a2e… granted",
    kind: "secret",
    note: "Don't log full session IDs or tokens; mask or hash them.",
  },
  {
    id: "spike",
    text: "10:22 user=ravi downloaded 4,000 invoices in 5 min",
    kind: "suspicious",
    note: "A huge spike for one user: likely data theft. Alert.",
  },
  {
    id: "view",
    text: "10:25 user=meera viewed invoice 1041",
    kind: "normal",
    note: "Routine access. Log it, no alert.",
  },
];

export type Phase = "govern" | "identify" | "protect" | "detect" | "respond" | "recover";

export const PHASES: { id: Phase; name: string; when: string; detail: string }[] = [
  {
    id: "govern",
    name: "Govern",
    when: "before",
    detail: "Decide who's responsible, and have a written incident plan people have practised.",
  },
  {
    id: "identify",
    name: "Identify",
    when: "before",
    detail: "Know your systems, data and the logs you'd need.",
  },
  {
    id: "protect",
    name: "Protect",
    when: "before",
    detail: "The defences from the rest of this track.",
  },
  {
    id: "detect",
    name: "Detect",
    when: "during",
    detail: "Spot it: alerts on suspicious logs, not just collecting them.",
  },
  {
    id: "respond",
    name: "Respond",
    when: "during",
    detail: "Contain it, remove access, preserve evidence, tell the people who must know.",
  },
  {
    id: "recover",
    name: "Recover",
    when: "after",
    detail: "Restore service, then learn: new cases, new alerts, fixes.",
  },
];

export const DUTIES: [string, string][] = [
  [
    "India, CERT-In (2022)",
    "Report listed incidents within 6 hours; keep logs 180 days within India; sync clocks to national time.",
  ],
  [
    "India, DPDP Rules 2025",
    "Tell the Data Protection Board and affected people without delay, with a detailed report within 72 hours (expected to apply from May 2027).",
  ],
  ["EU, GDPR", "Notify the regulator within 72 hours of becoming aware, where feasible."],
  [
    "Invite reports",
    "Publish a security.txt with a contact, so researchers can reach you (RFC 9116).",
  ],
];
