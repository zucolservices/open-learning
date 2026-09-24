"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ChatState } from "./state";
import { Connections, Journey, Landscape, Ordering, Transports, Wrap } from "./steps";

export default defineModule<ChatState>({
  initialState,
  steps: [
    { id: "transports", title: "Are we there yet?", Component: Transports },
    { id: "journey", title: "One message, end to end", Component: Journey },
    { id: "order", title: "Who spoke first?", checkpoint: "chat-order", Component: Ordering },
    { id: "connections", title: "Millions of open connections", Component: Connections },
    { id: "landscape", title: "How others do it", Component: Landscape },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
