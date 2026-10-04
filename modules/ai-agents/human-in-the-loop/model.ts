/** A month of 400 expense claims processed by an agent, and where a person checks. Illustrative. */

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a * 1664525 + 1013904223) % 4294967296;
    return a / 4294967296;
  };
}

const r = rng(42);
export const CLAIMS = Array.from({ length: 400 }, (_, i) => {
  const amount = Math.round(Math.exp(5.5 + r() * 4.2));
  const newVendor = r() < 0.1;
  return { id: i, amount, newVendor, error: false };
});
// The agent gets 12 claims wrong: some large, several from new vendors.
const ERR: [number, number, boolean][] = [
  [3, 48000, true],
  [17, 22000, false],
  [41, 9500, true],
  [77, 3100, false],
  [102, 1800, false],
  [150, 650, false],
  [188, 12500, true],
  [222, 900, false],
  [260, 4200, false],
  [301, 30500, false],
  [333, 700, true],
  [377, 2400, false],
];
for (const [i, amt, nv] of ERR) CLAIMS[i] = { id: i, amount: amt, newVendor: nv, error: true };

export function month(threshold: number, newVendors: boolean) {
  const asked = CLAIMS.filter((c) => c.amount >= threshold || (newVendors && c.newVendor));
  const n = asked.length;
  const catchRate = n <= 60 ? 0.95 : n <= 150 ? 0.75 : 0.45;
  // Attentive approvers notice the big, odd claims first; tired ones catch mistakes at random.
  const askedErrors = asked
    .filter((c) => c.error)
    .sort((a, b) =>
      catchRate > 0.9 ? b.amount - a.amount : ((a.id * 7) % 13) - ((b.id * 7) % 13),
    );
  const caught = new Set(
    askedErrors.slice(0, Math.round(askedErrors.length * catchRate)).map((c) => c.id),
  );
  const slipped = CLAIMS.filter((c) => c.error && !caught.has(c.id));
  return {
    asked: n,
    minutes: n * 2,
    catchRate,
    slipped: slipped.length,
    lost: slipped.reduce((a, c) => a + c.amount, 0),
    fatigue: n > 150,
  };
}

export const ROLES: { name: string; human: string; example: string }[] = [
  {
    name: "Operator",
    human: "You do the work; the agent helps when asked.",
    example: "You write the report; the agent suggests a sentence.",
  },
  {
    name: "Collaborator",
    human: "You and the agent work side by side, passing work back and forth.",
    example: "Co-editing a document together.",
  },
  {
    name: "Consultant",
    human: "The agent leads and asks your advice or preferences.",
    example: "It plans a trip, asking which hotel you prefer.",
  },
  {
    name: "Approver",
    human: "The agent works alone and asks only for blockers or important sign-offs.",
    example: "It drafts all replies; you approve refunds.",
  },
  {
    name: "Observer",
    human: "The agent acts fully on its own; you can only watch the logs.",
    example: "Overnight data clean-up with a morning report.",
  },
];
