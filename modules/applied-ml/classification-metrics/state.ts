/** Everything a learner can change in this module, saved for resume. */
export interface MetricsState {
  [key: string]: unknown;
  t: number;
  missCost: number;
  alarmCost: number;
  curve: "roc" | "pr";
}

export const initialState: MetricsState = { t: 0.5, missCost: 5000, alarmCost: 300, curve: "roc" };
