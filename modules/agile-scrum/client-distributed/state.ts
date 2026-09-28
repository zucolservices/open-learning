/** Everything a learner can change in this module, saved for resume. */
export interface ClientState {
  [key: string]: unknown;
  tailor: number;
  city: "london" | "newyork";
  season: "summer" | "winter";
  start: number;
  at: number;
  choices: Record<string, string>;
}

export const initialState: ClientState = {
  tailor: 0,
  city: "london",
  season: "summer",
  start: 9,
  at: 0,
  choices: {},
};
