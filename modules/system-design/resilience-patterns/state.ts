/** Everything a learner can change in this module, saved for resume. */
export interface ResState {
  [key: string]: unknown;
  timeout: boolean;
  breaker: boolean;
  bulkhead: boolean;
  bFrame: number;
  algo: "token" | "fixed" | "sliding";
  rate: number;
  burst: number;
}

export const initialState: ResState = {
  timeout: false,
  breaker: false,
  bulkhead: false,
  bFrame: 0,
  algo: "token",
  rate: 10,
  burst: 10,
};
