"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AttnState } from "./state";
import { HowManyHeads, NoPeeking, QueryKeyValue, WhoIsShe, Wrap } from "./steps";

export default defineModule<AttnState>({
  initialState,
  steps: [
    { id: "who", title: "Who is “she”?", Component: WhoIsShe },
    { id: "qkv", title: "Queries, keys and values", Component: QueryKeyValue },
    { id: "mask", title: "No peeking", checkpoint: "causal-mask", Component: NoPeeking },
    {
      id: "heads",
      title: "How many ways of looking?",
      checkpoint: "heads",
      Component: HowManyHeads,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
