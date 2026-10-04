"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TurnState } from "./state";
import { Walkie, Endpoint, VadFrames, Semantic, ReplyNow, Wrap } from "./steps";

export default defineModule<TurnState>({
  initialState,
  steps: [
    { id: "story", title: "Over and out", Component: Walkie },
    { id: "endpoint", title: "Tune the end of a turn", Component: Endpoint },
    { id: "vad", title: "Is anyone speaking?", Component: VadFrames },
    { id: "semantic", title: "Listening for meaning", Component: Semantic },
    { id: "check", title: "Reply now, or wait?", checkpoint: "reply-now", Component: ReplyNow },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
