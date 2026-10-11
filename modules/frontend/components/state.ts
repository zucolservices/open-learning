/** Everything a learner can change in this module, saved for resume. */
export interface CompState {
  [key: string]: unknown;
  props: string[];
  cart: number;
  hover: string | null;
  style: string;
}

export const initialState: CompState = { props: [], cart: 0, hover: null, style: "react" };
