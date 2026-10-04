"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SoundState } from "./state";
import { Flipbook, Sampler, Rates, Mel, WhichRate, Wrap } from "./steps";

export default defineModule<SoundState>({
  initialState,
  steps: [
    { id: "story", title: "A flipbook of air", Component: Flipbook },
    { id: "sampler", title: "Sample a word", Component: Sampler },
    { id: "rates", title: "Phones, CDs and speech models", Component: Rates },
    { id: "mel", title: "Hearing like an ear", Component: Mel },
    { id: "check", title: "Which sample rate?", checkpoint: "which-rate", Component: WhichRate },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
