"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MapState } from "./state";
import { River, TheMap, WhoAdapts, DrawYours, WhichRelation, Wrap } from "./steps";

export default defineModule<MapState>({
  initialState,
  steps: [
    { id: "story", title: "Upstream, downstream", Component: River },
    { id: "map", title: "The insurer's map", Component: TheMap },
    { id: "power", title: "Who adapts to whom?", Component: WhoAdapts },
    { id: "draw", title: "Drawing your own", Component: DrawYours },
    {
      id: "check",
      title: "Which relationship?",
      checkpoint: "which-relationship",
      Component: WhichRelation,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
