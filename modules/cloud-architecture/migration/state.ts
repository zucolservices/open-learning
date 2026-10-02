export type R =
  "retire" | "retain" | "rehost" | "relocate" | "repurchase" | "replatform" | "refactor";

/** Everything a learner can change in this module, saved for resume. */
export interface MigState {
  [key: string]: unknown;
  picks: Record<string, R>;
  tb: number;
  mbps: number;
  frame: number;
}

export const initialState: MigState = { picks: {}, tb: 100, mbps: 1000, frame: 0 };
