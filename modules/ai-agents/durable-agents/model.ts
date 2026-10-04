/** A refund agent that crashes and restarts, with and without checkpoints and idempotency. Illustrative. */

export const STEPS = [
  { id: "lookup", label: "Look up the order", effect: null },
  { id: "eligible", label: "Check refund rules", effect: null },
  { id: "approve", label: "Wait for a manager's approval (2 days)", effect: null },
  { id: "refund", label: "Issue the ₹4,200 refund", effect: "refund" },
  { id: "email", label: "Email the customer", effect: "email" },
  { id: "close", label: "Close the ticket", effect: null },
] as const;

export type Crash = "none" | "after-eligible" | "mid-refund" | "after-email";

export const CRASHES: { id: Crash; label: string }[] = [
  { id: "none", label: "No crash" },
  { id: "after-eligible", label: "Crash after checking the rules" },
  { id: "mid-refund", label: "Crash just after the money moves" },
  { id: "after-email", label: "Crash after the email" },
];

export function simulate(crash: Crash, checkpoints: boolean, idem: boolean) {
  const runs = STEPS.map(() => 0);
  let refunds = 0;
  let emails = 0;
  let approvals = 0;
  const exec = (i: number) => {
    runs[i]++;
    if (STEPS[i].id === "approve") approvals++;
    if (STEPS[i].effect === "refund" && (!idem || refunds === 0)) refunds++;
    if (STEPS[i].effect === "email") emails++;
  };
  let saved = -1;
  const crashAfter =
    crash === "after-eligible" ? 1 : crash === "mid-refund" ? 3 : crash === "after-email" ? 4 : -1;
  for (let i = 0; i < STEPS.length; i++) {
    exec(i);
    if (i === crashAfter) {
      // mid-refund: the side effect happened, but the crash came before the checkpoint was written
      if (crash !== "mid-refund" && checkpoints) saved = i;
      break;
    }
    if (checkpoints) saved = i;
  }
  if (crashAfter >= 0) for (let i = checkpoints ? saved + 1 : 0; i < STEPS.length; i++) exec(i);
  return { runs, refunds, emails, approvals };
}
