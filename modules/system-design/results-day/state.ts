/** Everything a learner can change in this module, saved for resume. */
export interface ResultsState {
  [key: string]: unknown;
  data: "db" | "cache" | "static";
  front: "single" | "lb" | "cdn";
  scale: "auto" | "prescale";
  sms: boolean;
  replayed: boolean;
}

export const initialState: ResultsState = {
  data: "db",
  front: "lb",
  scale: "auto",
  sms: false,
  replayed: false,
};
