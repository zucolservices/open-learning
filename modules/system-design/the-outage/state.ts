/** Everything a learner can change in this module, saved for resume. */
export interface OutageState {
  [key: string]: unknown;
  panel: string | null;
  tFrame: number;
  coalesce: boolean;
  budget: boolean;
  shed: boolean;
  replicas: boolean;
  restart: boolean;
}

export const initialState: OutageState = {
  panel: null,
  tFrame: 0,
  coalesce: false,
  budget: false,
  shed: false,
  replicas: false,
  restart: false,
};
