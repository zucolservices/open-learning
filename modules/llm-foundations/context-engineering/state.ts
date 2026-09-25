/** Everything a learner can change in this module, saved for resume. */
export interface ContextState {
  [key: string]: unknown;
  /** Context budget: which blocks are included. */
  blocks: string[];
  /** Conversation-memory strategy. */
  memory: string;
  /** Prompt-caching: order of the blocks. */
  order: string[];
}

export const initialState: ContextState = {
  blocks: ["system", "question"],
  memory: "all",
  order: ["question", "articles", "system", "tools", "catalogue"],
};
