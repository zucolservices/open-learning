/** Word-overlap metrics computed live, plus illustrative embedding similarities. */

export const REFERENCE = "Refunds are accepted within 14 days if the item is unused.";

export const CANDIDATES: {
  id: string;
  text: string;
  verdict: string;
  correct: boolean;
  emb: number;
}[] = [
  {
    id: "para",
    text: "You can get your money back within two weeks, as long as you haven't used it.",
    verdict: "Correct, different words",
    correct: true,
    emb: 0.84,
  },
  {
    id: "thirty",
    text: "Refunds are accepted within 30 days if the item is unused.",
    verdict: "Wrong number",
    correct: false,
    emb: 0.95,
  },
  {
    id: "not",
    text: "Refunds are not accepted within 14 days if the item is unused.",
    verdict: "Says the opposite",
    correct: false,
    emb: 0.93,
  },
  {
    id: "short",
    text: "Refunds are accepted within 14 days.",
    verdict: "Drops the condition",
    correct: false,
    emb: 0.9,
  },
  {
    id: "long",
    text: "Yes: if it's unused, we accept refunds for 14 days after delivery. Just contact support.",
    verdict: "Correct, more detail",
    correct: true,
    emb: 0.86,
  },
];

export function words(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function ngrams(w: string[], n: number) {
  const out: string[] = [];
  for (let i = 0; i + n <= w.length; i++) out.push(w.slice(i, i + n).join(" "));
  return out;
}

function clippedPrecision(c: string[], r: string[], n: number) {
  const cg = ngrams(c, n);
  if (!cg.length) return 0;
  const counts = new Map<string, number>();
  ngrams(r, n).forEach((g) => counts.set(g, (counts.get(g) ?? 0) + 1));
  let hit = 0;
  cg.forEach((g) => {
    const left = counts.get(g) ?? 0;
    if (left > 0) {
      hit++;
      counts.set(g, left - 1);
    }
  });
  return hit / cg.length;
}

/** BLEU over 1- and 2-word sequences (simplified for short answers), 0–1. */
export function bleu(cand: string, ref: string) {
  const c = words(cand);
  const r = words(ref);
  const p1 = clippedPrecision(c, r, 1);
  const p2 = clippedPrecision(c, r, 2);
  if (!p1 || !p2) return 0;
  const bp = c.length >= r.length ? 1 : Math.exp(1 - r.length / c.length);
  return bp * Math.sqrt(p1 * p2);
}

/** ROUGE-1 recall: share of the reference's words that appear in the answer. */
export function rouge1(cand: string, ref: string) {
  const c = words(cand);
  const r = words(ref);
  return r.length ? clippedPrecision(r, c, 1) : 0;
}

/** ROUGE-L recall: longest in-order shared word sequence, over reference length. */
export function rougeL(cand: string, ref: string) {
  const a = words(cand);
  const b = words(ref);
  const dp = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return b.length ? dp[a.length][b.length] / b.length : 0;
}
