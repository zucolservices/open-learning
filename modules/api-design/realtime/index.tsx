"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RtState } from "./state";
import { AreWeThere, LiveScores, Sse, Sockets, PickChannel, Wrap } from "./steps";

export default defineModule<RtState>({
  initialState,
  steps: [
    { id: "there", title: "Are we there yet?", Component: AreWeThere },
    { id: "scores", title: "Live scores, four ways", Component: LiveScores },
    { id: "sse", title: "Server-sent events", Component: Sse },
    { id: "ws", title: "WebSockets and beyond", Component: Sockets },
    { id: "check", title: "Pick the channel", checkpoint: "pick-channel", Component: PickChannel },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
