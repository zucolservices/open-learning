/** Everything a learner can change in this module, saved for resume. */
export interface CtxState {
  [key: string]: unknown;
  positions: boolean;
  rotPos: number;
  logTokens: number; // log10 of context length
  attn: "mha" | "gqa" | "mla";
}

export const initialState: CtxState = { positions: false, rotPos: 3, logTokens: 3.5, attn: "gqa" };
