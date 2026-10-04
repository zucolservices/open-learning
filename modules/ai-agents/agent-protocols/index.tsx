"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ProtoState } from "./state";
import { Embassy, Delegate, TwoDirections, Landscape, McpOrA2A, Wrap } from "./steps";

export default defineModule<ProtoState>({
  initialState,
  steps: [
    { id: "story", title: "A shared business language", Component: Embassy },
    { id: "delegate", title: "Delegate to another company's agent", Component: Delegate },
    { id: "directions", title: "Tools down, agents across", Component: TwoDirections },
    { id: "landscape", title: "The wider landscape", Component: Landscape },
    { id: "check", title: "MCP or A2A?", checkpoint: "mcp-or-a2a", Component: McpOrA2A },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
