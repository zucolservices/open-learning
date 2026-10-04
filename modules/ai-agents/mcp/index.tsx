"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type McpState } from "./state";
import { Plugs, Trace, MPlusN, Primitives, WhichPrimitive, Wrap } from "./steps";

export default defineModule<McpState>({
  initialState,
  steps: [
    { id: "story", title: "A drawer of chargers", Component: Plugs },
    { id: "trace", title: "Trace one request", Component: Trace },
    { id: "m-plus-n", title: "Why a standard helps", Component: MPlusN },
    { id: "primitives", title: "What servers offer", Component: Primitives },
    {
      id: "check",
      title: "Tool, resource or prompt?",
      checkpoint: "mcp-primitive",
      Component: WhichPrimitive,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
