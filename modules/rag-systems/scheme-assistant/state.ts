/** Everything a learner can change in this module, saved for resume. */
export interface SchemeState {
  [key: string]: unknown;
  chunk: "page" | "section" | "sentence" | "";
  search: "keyword" | "vector" | "hybrid" | "";
  rerank: "none" | "rerank" | "";
  prompt: "basic" | "strict" | "";
  ran: boolean;
  q: number;
  scheme: number;
}

export const initialState: SchemeState = {
  chunk: "",
  search: "",
  rerank: "",
  prompt: "",
  ran: false,
  q: 0,
  scheme: 0,
};
