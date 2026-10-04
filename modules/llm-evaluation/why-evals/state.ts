/** Everything a learner can change in this module, saved for resume. */
export interface WhyEvalsState {
  [key: string]: unknown;
  n: number;
  seed: number;
  ran: boolean;
}

export const initialState: WhyEvalsState = { n: 5, seed: 1, ran: false };
