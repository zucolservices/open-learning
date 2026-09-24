/** Everything a learner can change in this module, saved for resume. */
export interface ObsState {
  [key: string]: unknown;
  signal: "metrics" | "logs" | "traces";
  tFrame: number;
  picked: string | null;
  slo: number; // index into SLOS
  alerting: "naive" | "burn";
}

export const initialState: ObsState = {
  signal: "metrics",
  tFrame: 0,
  picked: null,
  slo: 2,
  alerting: "naive",
};
