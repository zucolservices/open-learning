/** Everything a learner can change in this module, saved for resume. */
export interface LatState {
  [key: string]: unknown;
  semantic: boolean;
  smallModel: boolean;
  cache: boolean;
  stream: boolean;
  colocate: boolean;
}

export const initialState: LatState = {
  semantic: false,
  smallModel: false,
  cache: false,
  stream: false,
  colocate: false,
};
