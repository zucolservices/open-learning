export type Liveness = "none" | "app" | "deep";
export type Readiness = "none" | "app" | "deep";

/** Everything a learner can change in this module, saved for resume. */
export interface HealthState {
  [key: string]: unknown;
  liveness: Liveness;
  startup: boolean;
  readiness: Readiness;
}

export const initialState: HealthState = { liveness: "app", startup: false, readiness: "none" };
