/** Everything a learner can change in this module, saved for resume. */
export interface DesiredState {
  [key: string]: unknown;
  target: number; // thermostat °C
  replicas: number;
  managed: boolean;
  frame: number;
}

export const initialState: DesiredState = { target: 24, replicas: 5, managed: true, frame: 0 };
