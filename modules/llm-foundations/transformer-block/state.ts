/** Everything a learner can change in this module, saved for resume. */
export interface BlockState {
  [key: string]: unknown;
  frame: number;
  prompt: number;
  layer: number;
  model: "gpt2" | "llama8b" | "llama70b";
}

export const initialState: BlockState = { frame: 0, prompt: 0, layer: 12, model: "gpt2" };
