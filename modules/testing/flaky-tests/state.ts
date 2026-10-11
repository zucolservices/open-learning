import type { Cause } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface FlakyState {
  [key: string]: unknown;
  ran: boolean;
  guesses: Record<string, Cause>;
  retries: boolean;
}

export const initialState: FlakyState = { ran: false, guesses: {}, retries: false };
