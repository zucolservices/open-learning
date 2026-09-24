/** Everything a learner can change in this module, saved for resume. */
export interface CdnState {
  [key: string]: unknown;
  cdn: boolean;
  user: string;
  ttl: number;
  variants: number;
  shield: boolean;
  publish: "ttl" | "purge" | "versioned";
}

export const initialState: CdnState = {
  cdn: false,
  user: "lon",
  ttl: 1,
  variants: 0,
  shield: false,
  publish: "ttl",
};
