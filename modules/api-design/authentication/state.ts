/** Everything a learner can change in this module, saved for resume. */
export interface AuthState {
  [key: string]: unknown;
  frame: number;
  token: string;
  checked: string[];
}

export const initialState: AuthState = { frame: 0, token: "good", checked: [] };
