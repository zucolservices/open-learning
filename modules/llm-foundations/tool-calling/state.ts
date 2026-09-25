/** Everything a learner can change in this module, saved for resume. */
export interface ToolState {
  [key: string]: unknown;
  /** Which real reply is fed to the parser. */
  reply: number;
  /** Constrained-decoding slot and whether the schema is enforced. */
  slot: number;
  enforce: boolean;
  /** Tool-calling loop: chosen question, frame, and whether a tool call is forced. */
  chat: number;
  frame: number;
  forced: boolean;
  /** Sandbox: the refund arguments being edited. */
  args: string;
}

export const REFUND_ARGS =
  '{"order_id": "KX-51102", "amount_rupees": 2340, "reason": "duplicate charges"}';

export const initialState: ToolState = {
  reply: 0,
  slot: 0,
  enforce: false,
  chat: 0,
  frame: 0,
  forced: false,
  args: REFUND_ARGS,
};
