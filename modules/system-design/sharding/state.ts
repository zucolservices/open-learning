import type { Scheme } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface ShardState {
  [key: string]: unknown;
  partitioning: "range" | "hash";
  scheme: Scheme;
  servers: number;
  hotFix: boolean;
  lookup: "scatter" | "global";
}

export const initialState: ShardState = {
  partitioning: "range",
  scheme: "mod",
  servers: 3,
  hotFix: false,
  lookup: "scatter",
};
