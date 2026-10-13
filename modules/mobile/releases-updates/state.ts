/** Everything a learner can change in this module, saved for resume. */
export interface RelState {
  [key: string]: unknown;
  mode: string;
  day: number;
  haltDay: number | null;
  flagDay: number | null;
  fixDay: number | null;
  retire: boolean;
  gate: boolean;
}

export const initialState: RelState = {
  mode: "all",
  day: 0,
  haltDay: null,
  flagDay: null,
  fixDay: null,
  retire: false,
  gate: false,
};
