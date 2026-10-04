"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AudioState } from "./state";
import { Cafe, MessyCall, Fairness, WhoSpoke, MatchFix, Wrap } from "./steps";

export default defineModule<AudioState>({
  initialState,
  steps: [
    { id: "story", title: "A call from a café", Component: Cafe },
    { id: "messy", title: "Make the call messy", Component: MessyCall },
    { id: "fairness", title: "Not everyone is heard equally", Component: Fairness },
    { id: "who", title: "Who spoke when?", Component: WhoSpoke },
    { id: "check", title: "Which fix?", checkpoint: "audio-fix", Component: MatchFix },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
