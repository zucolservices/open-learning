/** Everything a learner can change in this module, saved for resume. */
export interface DaState {
  [key: string]: unknown;
  orders: number;
  eager: boolean;
  instances: number;
  pool: number;
}

export const initialState: DaState = { orders: 20, eager: false, instances: 4, pool: 10 };
