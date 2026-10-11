/** Everything a learner can change in this module, saved for resume. */
export interface SignState {
  [key: string]: unknown;
  suspect: string;
  done: string[];
  spoof: boolean;
  miss: string;
}

export const initialState: SignState = { suspect: "", done: [], spoof: false, miss: "" };
