/** Everything a learner can change in this module, saved for resume. */
export interface PromptState {
  [key: string]: unknown;
  /** Colleague-briefing frame. */
  brief: number;
  /** Which prompt ingredients are switched on (bit mask: role 1, rules 2, examples 4, format 8). */
  mask: number;
  /** Selected test email. */
  email: number;
  /** Message-anatomy frame. */
  anatomy: number;
}

export const initialState: PromptState = { brief: 0, mask: 0, email: 0, anatomy: 0 };
