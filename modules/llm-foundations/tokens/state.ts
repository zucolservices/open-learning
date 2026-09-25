/** Everything a learner can change in this module, saved for resume. */
export interface TokensState {
  [key: string]: unknown;
  text: string;
  encoding: "r50k_base" | "cl100k_base" | "o200k_base";
  bpeStep: number;
  langEnc: "cl100k" | "o200k";
}

export const initialState: TokensState = {
  text: "I would like a cup of masala chai, please.",
  encoding: "o200k_base",
  bpeStep: 0,
  langEnc: "cl100k",
};
