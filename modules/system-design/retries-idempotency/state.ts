/** Everything a learner can change in this module, saved for resume. */
export interface RetryState {
  [key: string]: unknown;
  guarantee: "most" | "least" | "effectively";
  policy: "none" | "immediate" | "backoff" | "jitter";
  budget: boolean;
  spread: "fixed" | "exp" | "jitter";
  useKey: boolean;
  payAttempts: number; // 0 = not paid yet
}

export const initialState: RetryState = {
  guarantee: "most",
  policy: "none",
  budget: false,
  spread: "fixed",
  useKey: false,
  payAttempts: 0,
};
