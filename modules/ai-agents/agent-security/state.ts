/** Everything a learner can change in this module, saved for resume. */
export interface SecState {
  [key: string]: unknown;
  privateData: boolean;
  untrusted: boolean;
  exfil: boolean;
  approval: boolean;
  filter: boolean;
  disguised: boolean;
}

export const initialState: SecState = {
  privateData: true,
  untrusted: true,
  exfil: true,
  approval: false,
  filter: false,
  disguised: false,
};
