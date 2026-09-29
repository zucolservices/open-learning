/** Everything a learner can change in this module, saved for resume. */
export interface FreshState {
  [key: string]: unknown;
  sync: boolean;
  del: boolean;
  filter: boolean;
  q: number;
  field: string;
}

export const initialState: FreshState = {
  sync: false,
  del: false,
  filter: false,
  q: 0,
  field: "status",
};
