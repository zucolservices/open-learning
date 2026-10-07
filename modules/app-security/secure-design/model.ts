/** An attacker with a phished support-agent password versus layered defences on an admin panel. */

export type Layer = "network" | "mediation" | "defaults" | "least" | "alerts";

export const LAYERS: { id: Layer; name: string; principle: string; detail: string }[] = [
  {
    id: "network",
    name: "Admin panel only from managed devices",
    principle: "Defence in depth",
    detail: "A login from an unknown laptop abroad is refused, even with the right password.",
  },
  {
    id: "mediation",
    name: "Check permission on every request",
    principle: "Complete mediation",
    detail: "Not just once at login: each page and API call is checked again.",
  },
  {
    id: "defaults",
    name: "New pages deny by default",
    principle: "Fail-safe defaults",
    detail: "A forgotten “export” page is closed until someone grants access.",
  },
  {
    id: "least",
    name: "Support staff see one customer at a time",
    principle: "Least privilege",
    detail: "Enough to answer a ticket; no bulk export.",
  },
  {
    id: "alerts",
    name: "Alert on unusual volumes",
    principle: "Defence in depth",
    detail: "Hundreds of lookups an hour pages the security team.",
  },
];

export interface Step {
  what: string;
  stoppedBy: Layer[];
  ifStopped: string;
}

export const STEPS: Step[] = [
  {
    what: "Log in to the admin panel with the phished password",
    stoppedBy: ["network"],
    ifStopped: "Refused: not a managed device.",
  },
  {
    what: "Open the old, hidden “export all” page",
    stoppedBy: ["defaults", "mediation"],
    ifStopped: "Denied: no one was ever granted that page.",
  },
  {
    what: "Page through every customer record",
    stoppedBy: ["least"],
    ifStopped: "Only the customer on an open ticket is visible.",
  },
  {
    what: "Keep downloading for weeks",
    stoppedBy: ["alerts"],
    ifStopped: "Alert after the first hour; account locked.",
  },
];

/** Illustrative records exposed if the attack stops after `i` successful steps. */
export const EXPOSED = [0, 0, 0, 2_000, 2_000_000];

export function stopAt(on: Layer[]) {
  const i = STEPS.findIndex((s) => s.stoppedBy.some((l) => on.includes(l)));
  return i === -1 ? STEPS.length : i;
}

export const PRINCIPLES: [string, string, string][] = [
  [
    "Economy of mechanism",
    "Keep the design small and simple.",
    "Fewer moving parts, fewer places for bugs to hide.",
  ],
  [
    "Fail-safe defaults",
    "The starting answer is no.",
    "Access comes from explicit permission, not from forgetting to forbid.",
  ],
  [
    "Complete mediation",
    "Check every access, every time.",
    "Don't rely on a check made once at login.",
  ],
  [
    "Open design",
    "Security shouldn't depend on a secret design.",
    "Keep keys secret, not how the lock works.",
  ],
  [
    "Separation of privilege",
    "Require two keys for big actions.",
    "A payment over a limit needs a second approver.",
  ],
  [
    "Least privilege",
    "Give only the access the job needs.",
    "A reporting tool gets read-only access.",
  ],
  [
    "Least common mechanism",
    "Share as little as possible between users.",
    "One tenant's job can't see another's temporary files.",
  ],
  [
    "Psychological acceptability",
    "Make the secure way the easy way.",
    "If security is painful, people work around it.",
  ],
];
