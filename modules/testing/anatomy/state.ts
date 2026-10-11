/** Everything a learner can change in this module, saved for resume. */
export interface AnatomyState {
  [key: string]: unknown;
  arrange: number | null;
  assert: number | null;
  act: boolean;
  broken: boolean;
  ran: boolean;
  lang: "pytest" | "junit" | "go" | "vitest";
}

export const initialState: AnatomyState = {
  arrange: null,
  assert: null,
  act: false,
  broken: false,
  ran: false,
  lang: "pytest",
};
