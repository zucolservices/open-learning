/**
 * What each kind of stand-in for a payment service lets a test check, and how each behaves when
 * the real provider changes. The provider, its API and timings are made up and illustrative.
 */

export type Kind = "real" | "stub" | "fake" | "spy" | "mock";

export const KINDS: { id: Kind; label: string; code: string[]; blurb: string }[] = [
  {
    id: "real",
    label: "Real service",
    blurb:
      "The provider's test mode over the network: about a second per call, and sometimes down.",
    code: ["const payments = new PaymentsClient(TEST_KEY);"],
  },
  {
    id: "stub",
    label: "Stub",
    blurb: "Gives a canned answer. Here: always declines.",
    code: ["const payments = {", '  charge: () => ({ ok: false, reason: "declined" }),', "};"],
  },
  {
    id: "fake",
    label: "Fake",
    blurb: "A small working version: an in-memory ledger of cards and balances.",
    code: ["const payments = new InMemoryPayments({", '  "card-ok": 5000, "card-empty": 0,', "});"],
  },
  {
    id: "spy",
    label: "Spy",
    blurb:
      "Answers like a stub (approve or decline, as you choose) and records every call, so the test can check them afterwards.",
    code: [
      "const payments = { charge: vi.fn(() => ({ ok: true })) };",
      "// later:",
      "expect(payments.charge).toHaveBeenCalledWith(240);",
    ],
  },
  {
    id: "mock",
    label: "Mock",
    blurb: "Set up with expectations first; fails if the calls don't match.",
    code: [
      "const payments = mock(Payments);",
      "expect(payments.charge).calledOnceWith(240);",
      "placeOrder(order, payments);",
      "payments.verify();",
    ],
  },
];

export const QUESTIONS: { id: string; label: string; can: Kind[] }[] = [
  {
    id: "declined",
    label: "A declined card shows “Payment declined”",
    can: ["real", "stub", "fake", "spy", "mock"],
  },
  { id: "amount", label: "The card is charged exactly ₹240", can: ["real", "fake", "spy", "mock"] },
  {
    id: "fast",
    label: "The test runs in milliseconds, every time",
    can: ["stub", "fake", "spy", "mock"],
  },
  { id: "change", label: "Still catches the bug if the provider changes its API", can: ["real"] },
];

export const WHY: Record<string, Partial<Record<Kind, string>>> = {
  declined: {
    real: "Possible with the provider's special test card, if you know it.",
    stub: "Easy: the stub always declines.",
    fake: "Use the card with no balance.",
  },
  amount: {
    stub: "A stub only answers; it doesn't record what it was asked.",
    fake: "Check the ledger's balance afterwards.",
    spy: "Check the recorded call afterwards.",
    mock: "The expectation fails if the amount is wrong.",
  },
  fast: {
    real: "Network calls are slow and the service is sometimes down: slow and flaky.",
  },
  change: {
    real: "The real service rejects the old call.",
    stub: "The stub was written for the old API, so it happily agrees.",
    fake: "The fake copies the old behaviour, so it agrees too.",
    spy: "It records the old call and the test still passes.",
    mock: "It expects the old call, so the test still passes.",
  },
};
