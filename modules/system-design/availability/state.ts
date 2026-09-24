/** Everything a learner can change in this module, saved for resume. */
export interface AvailState {
  [key: string]: unknown;
  level: number; // index into LEVELS
  app: number;
  db: number;
  pay: number;
  spread: boolean;
  outage: number;
}

export const initialState: AvailState = {
  level: 1,
  app: 1,
  db: 1,
  pay: 1,
  spread: false,
  outage: 1,
};
