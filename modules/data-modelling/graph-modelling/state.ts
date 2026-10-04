/** Everything a learner can change in this module, saved for resume. */
export interface GraphState {
  [key: string]: unknown;
  hops: number;
  rdf: boolean;
}

export const initialState: GraphState = { hops: 1, rdf: false };
