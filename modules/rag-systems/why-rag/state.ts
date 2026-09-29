/** Everything a learner can change in this module, saved for resume. */
export interface WhyRagState {
  [key: string]: unknown;
  approach: "rag" | "finetune" | "long";
}

export const initialState: WhyRagState = { approach: "rag" };
