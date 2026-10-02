/** Everything a learner can change in this module, saved for resume. */
export interface ChainState {
  [key: string]: unknown;
  attack: string;
  picks: Record<string, string>;
  slsa: number;
}

export const initialState: ChainState = { attack: "xz", picks: {}, slsa: 0 };
