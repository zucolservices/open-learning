/** Everything a learner can change in this module, saved for resume. */
export interface MisbehaveState {
  [key: string]: unknown;
  /** Chosen cause per case id. */
  dx: Record<string, string>;
  /** Chosen fix per case id. */
  fix: Record<string, string>;
  /** Case ids that have been re-tested after a good fix. */
  retested: string[];
  /** Temperature shown in the sampling re-test. */
  temp: string;
}

export const initialState: MisbehaveState = {
  dx: {},
  fix: {},
  retested: [],
  temp: "1.2",
};
