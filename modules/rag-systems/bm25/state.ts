/** Everything a learner can change in this module, saved for resume. */
export interface Bm25State {
  [key: string]: unknown;
  query: string;
  stop: boolean;
  stem: boolean;
  k1: number;
  b: number;
  lenRatio: number;
}

export const initialState: Bm25State = {
  query: "water connection fee",
  stop: true,
  stem: true,
  k1: 1.2,
  b: 0.75,
  lenRatio: 1,
};
