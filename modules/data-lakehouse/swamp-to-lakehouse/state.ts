export type Architecture = "warehouse" | "lake" | "two-tier" | "lakehouse";

/** Everything a learner can change in this module, saved for resume. */
export interface SwampState {
  [key: string]: unknown;
  reportRunning: boolean;
  separated: boolean;
  architecture: Architecture;
}

export const initialState: SwampState = {
  reportRunning: false,
  separated: false,
  architecture: "warehouse",
};
