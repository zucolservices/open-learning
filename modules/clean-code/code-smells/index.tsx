"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SmellState } from "./state";
import { Fridge, Spot, Catalogue, Prioritise, SmellCheck, Wrap } from "./steps";

export default defineModule<SmellState>({
  initialState,
  steps: [
    { id: "story", title: "A smell in the fridge", Component: Fridge },
    { id: "spot", title: "Sniff out the smells, then pick the cure", Component: Spot },
    { id: "catalogue", title: "The catalogue of smells", Component: Catalogue },
    { id: "prioritise", title: "Which smells to fix first", Component: Prioritise },
    { id: "check", title: "Name the smell", checkpoint: "clean-smells", Component: SmellCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
