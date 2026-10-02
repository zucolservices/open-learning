/** Everything a learner can change in this module, saved for resume. */
export interface DebugState {
  [key: string]: unknown;
  incident: number;
  ran: Record<string, string[]>; // incident id → commands run
  answer: Record<string, string>; // incident id → chosen diagnosis
}

export const initialState: DebugState = { incident: 0, ran: {}, answer: {} };
