"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ToolState } from "./state";
import {
  BreakTheSchema,
  ConstrainedDecoding,
  Names,
  OrderTheLoop,
  ProseBreaksCode,
  ToolLoop,
  WhoApproves,
  Wrap,
} from "./steps";

export default defineModule<ToolState>({
  initialState,
  steps: [
    { id: "prose", title: "Prose breaks code", Component: ProseBreaksCode },
    { id: "constrained", title: "Only valid words allowed", Component: ConstrainedDecoding },
    { id: "loop", title: "The tool-calling loop", Component: ToolLoop },
    { id: "sandbox", title: "Break the schema", Component: BreakTheSchema },
    {
      id: "order",
      title: "Put the loop in order",
      checkpoint: "loop-order",
      Component: OrderTheLoop,
    },
    {
      id: "approve",
      title: "Run it, or ask first?",
      checkpoint: "approve",
      Component: WhoApproves,
    },
    { id: "names", title: "Names you'll meet", Component: Names },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
