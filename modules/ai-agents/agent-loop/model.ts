/** One agent run, turn by turn: a delivery question answered with two tools. Illustrative. */

export type Role = "user" | "model" | "tool";
export type Phase = "goal" | "think" | "act" | "observe" | "done";

export interface Msg {
  role: Role;
  text: string;
  call?: string;
}

export interface Frame {
  phase: Phase;
  title: string;
  caption: string;
  add: Msg;
  turn: number;
}

export const FRAMES: Frame[] = [
  {
    phase: "goal",
    turn: 0,
    title: "Your code sends the goal and the tools",
    caption:
      "The model gets the user's message plus descriptions of two tools it may use: get_order and shipping_options.",
    add: {
      role: "user",
      text: "Will order 4417 arrive before Friday? If not, upgrade the shipping.",
    },
  },
  {
    phase: "act",
    turn: 1,
    title: "Turn 1: the model asks for a tool",
    caption:
      "It can't know the order's status, so it replies with a structured tool call instead of an answer. Nothing has happened in the world yet.",
    add: {
      role: "model",
      text: "I need the order's delivery estimate.",
      call: 'get_order(order_id="4417")',
    },
  },
  {
    phase: "observe",
    turn: 1,
    title: "Your code runs it and sends back the result",
    caption:
      "The application, not the model, calls the order system. The result goes back into the conversation as an observation.",
    add: { role: "tool", text: '{ "status": "packed", "estimate": "Monday" }' },
  },
  {
    phase: "act",
    turn: 2,
    title: "Turn 2: it decides the next step",
    caption:
      "Monday is too late, so the model chooses another tool. Nobody programmed this branch; it read the result and decided.",
    add: {
      role: "model",
      text: "Monday misses Friday. Let me check faster options.",
      call: 'shipping_options(order_id="4417")',
    },
  },
  {
    phase: "observe",
    turn: 2,
    title: "Another observation",
    caption:
      "Two options come back. Upgrading costs money, so a well-designed agent asks before acting.",
    add: { role: "tool", text: '[{ "speed": "express", "arrives": "Thursday", "cost": "₹149" }]' },
  },
  {
    phase: "done",
    turn: 3,
    title: "Turn 3: no tool call, so the loop ends",
    caption:
      "The model replies with plain text and no tool call. That's the normal way a loop stops: the model says it's finished, for now.",
    add: {
      role: "model",
      text: "It's due Monday, after Friday. Express delivery would arrive Thursday for ₹149. Shall I upgrade it?",
    },
  },
];

export const PHASES: { id: Phase; label: string }[] = [
  { id: "think", label: "Think" },
  { id: "act", label: "Act" },
  { id: "observe", label: "Observe" },
];
