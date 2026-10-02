export type Kind = "deployment" | "statefulset" | "daemonset" | "job" | "cronjob";

/** Everything a learner can change in this module, saved for resume. */
export interface WlState {
  [key: string]: unknown;
  kind: Kind;
}

export const initialState: WlState = { kind: "deployment" };
