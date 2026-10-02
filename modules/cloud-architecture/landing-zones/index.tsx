"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LzState } from "./state";
import { Assemble, Blueprints, GoodOrPitfall, Township, Vend, Wrap } from "./steps";

export default defineModule<LzState>({
  initialState,
  steps: [
    { id: "township", title: "Roads before houses", Component: Township },
    { id: "assemble", title: "Assemble a landing zone", Component: Assemble },
    { id: "vend", title: "Vend a new account", Component: Vend },
    { id: "blueprints", title: "Each cloud's blueprint", Component: Blueprints },
    {
      id: "check",
      title: "Good practice or pitfall?",
      checkpoint: "lz-pitfalls",
      Component: GoodOrPitfall,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
