/**
 * A made-up refund endpoint with four security problems, and the four questions a reviewer asks
 * to find them. The secret is shown only as a placeholder; no real keys or attack inputs.
 */

export const DIFF = [
  ' router.post("/orders/:id/refund", async (req, res) => {',
  "+  const order = await db.orders.find(req.params.id);",
  "+  const amount = req.body.amount;",
  '+  const gateway = new Gateway("<live secret key pasted here>");',
  '+  log.info("refund", req.body, order.cardNumber);',
  "+  await gateway.refund(order.paymentId, amount);",
  "+  res.json({ ok: true });",
  " });",
];

export interface Question {
  id: string;
  ask: string;
  lines: number[];
  comment: string;
  hint: string;
}

export const QUESTIONS: Question[] = [
  {
    id: "input",
    ask: "Trace untrusted input. Which value from the request is used without any check?",
    lines: [2, 5],
    comment:
      "The refund amount comes straight from the request. Nothing stops a negative amount or one larger than the customer paid. Check it against the order.",
    hint: "Look for req.body: anything a caller sends can be anything at all.",
  },
  {
    id: "authz",
    ask: "Check permission. Is anything stopping one customer refunding someone else's order?",
    lines: [0, 1],
    comment:
      "Any signed-in caller can refund any order just by changing the id in the address. Check the order belongs to them, or that they're staff.",
    hint: "Where is the order looked up, and who is it checked against?",
  },
  {
    id: "secret",
    ask: "Look for secrets. Is anything sensitive written into the code itself?",
    lines: [3],
    comment:
      "A live payment key in source code is visible to everyone with repo access and stays in history forever. Load it from a secret store, and rotate this one.",
    hint: "Keys and passwords belong in configuration, not code.",
  },
  {
    id: "leak",
    ask: "Check logs and errors. Does anything leak sensitive data?",
    lines: [4],
    comment:
      "This logs the whole request and the full card number. Logs are widely readable; log the order id only.",
    hint: "What ends up in the log file?",
  },
];

export type Verdict = "approve" | "changes" | "specialist";

export const VERDICTS: { id: Verdict; label: string; result: string; best: boolean }[] = [
  {
    id: "approve",
    label: "Approve with comments",
    result:
      "The author fixes the key but misses the permission check. A month later, refunds start appearing on orders their owners never asked about.",
    best: false,
  },
  {
    id: "changes",
    label: "Request changes",
    result:
      "Good: nothing ships until the four issues are fixed. But this touches money and permissions; a second look from someone who reviews security for a living would be wise.",
    best: false,
  },
  {
    id: "specialist",
    label: "Request changes and ask the security team",
    result:
      "The fixes land, and the security reviewer also spots that refunds aren't rate-limited. Payment and permission code gets a specialist review as a matter of routine.",
    best: true,
  },
];
