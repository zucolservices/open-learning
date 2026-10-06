/** Spam filtering by hand-written rules versus learned word weights. Emails are made up. */

export interface Email {
  text: string;
  spam: boolean;
}

export const TRAIN: Email[] = [
  { text: "win a free prize now click here", spam: true },
  { text: "free gift card claim your reward today", spam: true },
  { text: "you are a winner claim cash now", spam: true },
  { text: "limited offer cheap pills buy now", spam: true },
  { text: "urgent your account will be closed verify now", spam: true },
  { text: "earn money from home no experience", spam: true },
  { text: "exclusive deal click here to claim", spam: true },
  { text: "congratulations you won a free holiday", spam: true },
  { text: "cheap loans approved instantly click now", spam: true },
  { text: "verify your password urgent action required", spam: true },
  { text: "lunch on friday with the team", spam: false },
  { text: "minutes from monday project meeting attached", spam: false },
  { text: "can you review my report before friday", spam: false },
  { text: "your order has shipped tracking number inside", spam: false },
  { text: "mum says dinner is at seven on sunday", spam: false },
  { text: "invoice for september attached please pay", spam: false },
  { text: "free tickets for the team outing on friday", spam: false },
  { text: "reminder dentist appointment on tuesday", spam: false },
  { text: "notes from the project review meeting", spam: false },
  { text: "can we move our call to thursday", spam: false },
];

export const TEST: Email[] = [
  { text: "claim your free reward click here", spam: true },
  { text: "urgent verify your bank account now", spam: true },
  { text: "cheap watches exclusive offer today", spam: true },
  { text: "you won cash prize claim now", spam: true },
  { text: "earn money fast work from home", spam: true },
  { text: "is the project meeting still on friday", spam: false },
  { text: "free parking at the office from monday", spam: false },
  { text: "your parcel has shipped", spam: false },
  { text: "please review the attached invoice", spam: false },
  { text: "dinner with mum on sunday", spam: false },
];

export const RULES: { id: string; label: string; words: string[] }[] = [
  { id: "free", label: "contains “free”", words: ["free"] },
  { id: "click", label: "contains “click”", words: ["click"] },
  { id: "now", label: "contains “now”", words: ["now"] },
  { id: "win", label: "contains “win”, “won” or “winner”", words: ["win", "won", "winner"] },
  { id: "urgent", label: "contains “urgent”", words: ["urgent"] },
  { id: "cheap", label: "contains “cheap”", words: ["cheap"] },
];

const words = (t: string) => t.split(" ");

export function ruleFlags(e: Email, rules: string[]) {
  const w = words(e.text);
  return RULES.some((r) => rules.includes(r.id) && r.words.some((x) => w.includes(x)));
}

/** Naive-Bayes-style word weights (log-odds, add-one smoothing) learned from n training emails. */
export function learn(n: number) {
  const data = TRAIN.slice(0, n / 2).concat(TRAIN.slice(10, 10 + n / 2));
  const count = { spam: new Map<string, number>(), ham: new Map<string, number>() };
  let sTot = 0;
  let hTot = 0;
  data.forEach((e) =>
    words(e.text).forEach((w) => {
      const m = e.spam ? count.spam : count.ham;
      m.set(w, (m.get(w) ?? 0) + 1);
      if (e.spam) sTot++;
      else hTot++;
    }),
  );
  const vocab = new Set([...count.spam.keys(), ...count.ham.keys()]);
  const weight = new Map<string, number>();
  vocab.forEach((w) => {
    const ps = ((count.spam.get(w) ?? 0) + 1) / (sTot + vocab.size);
    const ph = ((count.ham.get(w) ?? 0) + 1) / (hTot + vocab.size);
    weight.set(w, Math.log(ps / ph));
  });
  return weight;
}

export function score(e: Email, weight: Map<string, number>) {
  return words(e.text).reduce((a, w) => a + (weight.get(w) ?? 0), 0);
}

export function results(flags: boolean[]) {
  const caught = TEST.filter((e, i) => e.spam && flags[i]).length;
  const blocked = TEST.filter((e, i) => !e.spam && flags[i]).length;
  return {
    caught,
    spam: TEST.filter((e) => e.spam).length,
    blocked,
    good: TEST.filter((e) => !e.spam).length,
  };
}
