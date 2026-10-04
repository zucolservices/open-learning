/** A judge's verdicts against an expert's labels on 50 outputs (10 real fails). Illustrative. */

export interface Version {
  id: string;
  name: string;
  rubric: string;
  caught: number; // expert fail, judge fail
  missed: number; // expert fail, judge pass
  falseFail: number; // expert pass, judge fail
  example: string;
}

export const TOTAL = 50;

export const VERSIONS: Version[] = [
  {
    id: "lazy",
    name: "Always pass",
    rubric: "(The judge says PASS to everything.)",
    caught: 0,
    missed: 10,
    falseFail: 0,
    example:
      "It never fails anything, yet agrees with the expert 80% of the time, because 80% of outputs pass.",
  },
  {
    id: "v1",
    name: "Rubric v1",
    rubric: "Is this a good customer-support reply? PASS or FAIL.",
    caught: 3,
    missed: 7,
    falseFail: 4,
    example:
      "Expert: FAIL, “promises a 30-day refund; policy is 14”. Judge: PASS, “friendly and helpful”.",
  },
  {
    id: "v2",
    name: "Rubric v2",
    rubric: "+ Any statement that contradicts the policy is a FAIL. Policy: {policy}",
    caught: 7,
    missed: 3,
    falseFail: 5,
    example: "Expert: PASS, “brief but correct”. Judge: FAIL, “too short to be helpful”.",
  },
  {
    id: "v3",
    name: "Rubric v3",
    rubric: "+ Length does not matter. + Three of the expert's critiques as examples.",
    caught: 9,
    missed: 1,
    falseFail: 2,
    example:
      "Remaining miss: “asks for the order number twice”. The expert hadn't written that rule down until now.",
  },
];

export function stats(v: Version) {
  const fails = v.caught + v.missed;
  const passes = TOTAL - fails;
  const trueNeg = passes - v.falseFail;
  const po = (v.caught + trueNeg) / TOTAL;
  const judgeFail = (v.caught + v.falseFail) / TOTAL;
  const humanFail = fails / TOTAL;
  const pe = judgeFail * humanFail + (1 - judgeFail) * (1 - humanFail);
  const kappa = pe === 1 ? 0 : (po - pe) / (1 - pe);
  return {
    trueNeg,
    agreement: po,
    kappa,
    recallFail: fails ? v.caught / fails : 0,
    precisionFail: v.caught + v.falseFail ? v.caught / (v.caught + v.falseFail) : 0,
  };
}

/** Kappa when both raters have the same pass rate and agree on a share po of items. */
export function kappaFor(po: number, passRate: number) {
  const pe = passRate * passRate + (1 - passRate) * (1 - passRate);
  return pe === 1 ? 0 : (po - pe) / (1 - pe);
}

export function landisKoch(k: number) {
  if (k < 0) return "worse than chance";
  if (k <= 0.2) return "slight";
  if (k <= 0.4) return "fair";
  if (k <= 0.6) return "moderate";
  if (k <= 0.8) return "substantial";
  return "almost perfect";
}
