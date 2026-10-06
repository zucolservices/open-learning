/** Fraud scores for 200 transactions (20 fraud), threshold metrics, ROC and PR curves. Made up. */

function rnd(i: number, k: number) {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const clamp = (v: number) => Math.min(0.99, Math.max(0.01, v));

export const TX: { score: number; fraud: boolean }[] = Array.from({ length: 200 }, (_, i) => {
  const fraud = i < 20;
  const noise = (rnd(i, 1) + rnd(i, 2) + rnd(i, 3) - 1.5) * 0.36;
  return { fraud, score: clamp((fraud ? 0.68 : 0.3) + noise) };
});

export function at(t: number) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  TX.forEach((x) => {
    const yes = x.score >= t;
    if (yes && x.fraud) tp++;
    else if (yes) fp++;
    else if (x.fraud) fn++;
    else tn++;
  });
  const precision = tp + fp ? tp / (tp + fp) : 1;
  const recall = tp / (tp + fn);
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
  return {
    tp,
    fp,
    fn,
    tn,
    precision,
    recall,
    f1,
    accuracy: (tp + tn) / TX.length,
    fpr: fp / (fp + tn),
  };
}

export const THRESHOLDS = Array.from({ length: 101 }, (_, i) => i / 100);

export function auc() {
  const pos = TX.filter((x) => x.fraud);
  const neg = TX.filter((x) => !x.fraud);
  let w = 0;
  pos.forEach((p) =>
    neg.forEach((n) => (w += p.score > n.score ? 1 : p.score === n.score ? 0.5 : 0)),
  );
  return w / (pos.length * neg.length);
}

export function cost(t: number, missCost: number, alarmCost: number) {
  const m = at(t);
  return m.fn * missCost + m.fp * alarmCost;
}
