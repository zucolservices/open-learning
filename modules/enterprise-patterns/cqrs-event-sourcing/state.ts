import type { Ev } from "./model";

/** Everything a learner can change in this module, saved for resume. */
export interface EsState {
  [key: string]: unknown;
  added: Ev[];
  at: number;
  frame: number;
  triedDelete: boolean;
}

export const initialState: EsState = { added: [], at: -1, frame: 0, triedDelete: false };
