/** Everything a learner can change in this module, saved for resume. */
export interface LakeState {
  [key: string]: unknown;
  interval: number; // seconds between commits
  writers: number;
  partitions: number;
  shuffle: boolean;
  compact: boolean;
  frame: number;
}

export const initialState: LakeState = {
  interval: 60,
  writers: 10,
  partitions: 24,
  shuffle: false,
  compact: false,
  frame: 0,
};
