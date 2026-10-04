/** A bank account as a list of events; state is derived by replaying them (illustrative). */

export interface Ev {
  type: string;
  amount: number;
  note?: string;
  category?: string;
}

export const START: Ev[] = [
  { type: "AccountOpened", amount: 0 },
  { type: "MoneyDeposited", amount: 10000, note: "salary", category: "income" },
  { type: "MoneyWithdrawn", amount: -4000, note: "rent", category: "housing" },
  { type: "CardPurchase", amount: -300, note: "coffee", category: "food" },
];

export const ADDABLE: { label: string; ev: Ev }[] = [
  {
    label: "Deposit ₹1,000",
    ev: { type: "MoneyDeposited", amount: 1000, note: "refund", category: "income" },
  },
  {
    label: "Groceries ₹1,200",
    ev: { type: "CardPurchase", amount: -1200, note: "groceries", category: "food" },
  },
  {
    label: "Charged ₹2,000 by mistake",
    ev: { type: "CardPurchase", amount: -2000, note: "duplicate charge", category: "shopping" },
  },
  {
    label: "Reverse the mistaken charge",
    ev: {
      type: "ChargeReversed",
      amount: 2000,
      note: "reverses duplicate charge",
      category: "shopping",
    },
  },
];

export function balance(events: Ev[], upTo: number) {
  return events.slice(0, upTo).reduce((s, e) => s + e.amount, 0);
}

export function spendByCategory(events: Ev[]) {
  const out: Record<string, number> = {};
  for (const e of events)
    if (e.category && e.category !== "income") out[e.category] = (out[e.category] ?? 0) - e.amount;
  return out;
}

export const FRAMES = [
  {
    title: "Commands go to the write side",
    text: '"Withdraw ₹500" is checked against the rules (enough money?) by the account aggregate, which appends a MoneyWithdrawn event to the event store. Nothing is overwritten.',
    show: ["write"],
  },
  {
    title: "Projections build read models",
    text: "A projection listens to the events and keeps a read model up to date: here, a table of current balances that the app queries. Reads never touch the write model.",
    show: ["write", "balances"],
  },
  {
    title: "A new question, years later",
    text: "Finance asks for spending by category for every customer since day one. Write a new projection and replay all the events from the start: the history was never thrown away.",
    show: ["write", "balances", "categories"],
  },
  {
    title: "Eventually consistent",
    text: "Read models catch up a moment after each event. If a customer must see their own withdrawal instantly, the screen needs to handle that gap.",
    show: ["write", "balances", "categories", "lag"],
  },
];
