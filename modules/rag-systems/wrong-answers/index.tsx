"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type WrongState } from "./state";
import { CarWontStart, Investigate, Maps, ReadTrace, WhereToLook, Wrap } from "./steps";

export default defineModule<WrongState>({
  initialState,
  steps: [
    { id: "car", title: "The car that won't start", Component: CarWontStart },
    { id: "trace", title: "Reading a trace", Component: ReadTrace },
    { id: "investigate", title: "Five wrong answers", Component: Investigate },
    { id: "maps", title: "Maps of what goes wrong", Component: Maps },
    {
      id: "where",
      title: "Where would you look?",
      checkpoint: "where-to-look",
      Component: WhereToLook,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
