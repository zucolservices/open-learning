"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type S2sState } from "./state";
import { Interpreter, SameCall, Traits, Landscape, BestFit, Wrap } from "./steps";

export default defineModule<S2sState>({
  initialState,
  steps: [
    { id: "story", title: "Interpreter or bilingual friend?", Component: Interpreter },
    { id: "same", title: "The same call, two ways", Component: SameCall },
    { id: "traits", title: "What you gain and lose", Component: Traits },
    { id: "landscape", title: "Speech-to-speech models today", Component: Landscape },
    { id: "check", title: "Which suits it?", checkpoint: "s2s-fit", Component: BestFit },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
