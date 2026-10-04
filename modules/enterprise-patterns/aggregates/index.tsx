"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AggState } from "./state";
import { SameOrEqual, TwoClerks, FourRules, AroundAggregates, EntityOrValue, Wrap } from "./steps";

export default defineModule<AggState>({
  initialState,
  steps: [
    { id: "story", title: "The same, or just equal?", Component: SameOrEqual },
    { id: "clerks", title: "Two clerks, one order", Component: TwoClerks },
    { id: "rules", title: "Four rules of thumb", Component: FourRules },
    { id: "around", title: "Repositories and events", Component: AroundAggregates },
    {
      id: "check",
      title: "Entity or value?",
      checkpoint: "entity-or-value",
      Component: EntityOrValue,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
