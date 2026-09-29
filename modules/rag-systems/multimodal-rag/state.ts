/** Everything a learner can change in this module, saved for resume. */
export interface MultimodalState {
  [key: string]: unknown;
  q: number;
  page: string;
  view: "ocr" | "caption";
}

export const initialState: MultimodalState = { q: 0, page: "p1-chart", view: "ocr" };
