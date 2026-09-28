/** Everything a learner can change in this module, saved for resume. */
export interface ArtifactsState {
  [key: string]: unknown;
  /** Links made: artifact index → commitment index. */
  links: Record<string, number>;
  /** Currently selected artifact (to link). */
  sel: number;
  /** Learner's call per candidate: "done" | "not". */
  calls: Record<string, string>;
}

export const initialState: ArtifactsState = { links: {}, sel: -1, calls: {} };
