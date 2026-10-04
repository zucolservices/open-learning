"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MmState } from "./state";
import { Houses, HowMany, Definitions, Stories, PickShape, Wrap } from "./steps";

export default defineModule<MmState>({
  initialState,
  steps: [
    { id: "story", title: "One house or a street?", Component: Houses },
    { id: "sizes", title: "One, five or fifty", Component: HowMany },
    { id: "definitions", title: "What a microservice is", Component: Definitions },
    { id: "stories", title: "Real stories", Component: Stories },
    { id: "check", title: "Pick a shape", checkpoint: "pick-shape", Component: PickShape },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
