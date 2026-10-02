import type { Way } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface MigrationState {
  [key: string]: unknown;
  way: Way;
  frame: number;
  lockTimeout: boolean;
}

export const initialState: MigrationState = { way: "naive", frame: 0, lockTimeout: false };
