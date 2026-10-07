/** The 2017 Equifax breach as an attack chain, and which defences would have stopped each step. */

export type Defence = "patch" | "inventory" | "segment" | "secrets" | "monitor";

export const DEFENCES: { id: Defence; name: string; detail: string }[] = [
  {
    id: "patch",
    name: "Patch within 48 hours",
    detail: "The company's own rule, applied to every system.",
  },
  {
    id: "inventory",
    name: "Know every system",
    detail: "An up-to-date list of what runs where, so nothing is missed.",
  },
  {
    id: "segment",
    name: "Separate the databases",
    detail: "The dispute site needed 3 databases but could reach 48.",
  },
  {
    id: "secrets",
    name: "No passwords in plain files",
    detail: "Credentials kept in a protected vault, not a readable file.",
  },
  {
    id: "monitor",
    name: "Working traffic monitoring",
    detail: "Keep the inspection device's certificate renewed.",
  },
];

export interface Stage {
  name: string;
  what: string;
  stoppedBy: Defence[];
}

export const STAGES: Stage[] = [
  {
    name: "Break in",
    what: "Exploit the Struts flaw on an old, unpatched dispute website.",
    stoppedBy: ["patch", "inventory"],
  },
  {
    name: "Find credentials",
    what: "Discover a file of usernames and passwords stored unencrypted.",
    stoppedBy: ["secrets"],
  },
  {
    name: "Reach more data",
    what: "Use those passwords to query databases far beyond the dispute site.",
    stoppedBy: ["segment"],
  },
  {
    name: "Copy data out unseen",
    what: "Run about 9,000 queries over 76 days without being noticed.",
    stoppedBy: ["monitor"],
  },
];

/** Index of the first stage a defence blocks, or STAGES.length if the attack succeeds. */
export function blockedAt(on: Defence[]) {
  const i = STAGES.findIndex((s) => s.stoppedBy.some((d) => on.includes(d)));
  return i === -1 ? STAGES.length : i;
}
