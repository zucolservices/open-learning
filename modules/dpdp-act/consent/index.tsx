"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ConsentState } from "./state";
import { AYes, Designer, ActExamples, ProveIt, ConsentCheck, Wrap } from "./steps";

export default defineModule<ConsentState>({
  initialState,
  steps: [
    { id: "story", title: "What counts as a yes?", Component: AYes },
    { id: "designer", title: "Design the sign-up screen", Component: Designer },
    { id: "examples", title: "Part of a yes", Component: ActExamples },
    { id: "prove", title: "If asked, can you prove it?", Component: ProveIt },
    {
      id: "check",
      title: "Valid consent or not?",
      checkpoint: "dpdp-consent",
      Component: ConsentCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
