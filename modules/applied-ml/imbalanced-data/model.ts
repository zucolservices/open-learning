/** Fraud at 1 in 500: outcomes per 100,000 transactions under different fixes. Illustrative. */

export const N = 100000;
export const FRAUD = 200;
export const MISS_COST = 20000;
export const ALARM_COST = 100;

export interface Setup {
  rebalance: boolean; // class weights or SMOTE
  costThreshold: boolean;
}

export function outcome(s: Setup) {
  let caught: number;
  let alarms: number;
  if (!s.rebalance && !s.costThreshold) [caught, alarms] = [40, 30];
  else if (!s.rebalance && s.costThreshold) [caught, alarms] = [160, 1300];
  else if (s.rebalance && !s.costThreshold) [caught, alarms] = [150, 1800];
  else [caught, alarms] = [196, 21000];
  const accuracy = (N - (FRAUD - caught) - alarms) / N;
  return {
    caught,
    missed: FRAUD - caught,
    alarms,
    accuracy,
    precision: caught / (caught + alarms),
    recall: caught / FRAUD,
    cost: (FRAUD - caught) * MISS_COST + alarms * ALARM_COST,
    calibrated: !s.rebalance,
  };
}

/** The cost-based threshold on a calibrated probability: flag if p ≥ C_FP / (C_FP + C_FN). */
export const costThreshold = ALARM_COST / (ALARM_COST + MISS_COST);
