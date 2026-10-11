"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AnatomyState } from "./state";
import { Recipe, Assemble, ReadFailure, SameShape, AnatomyCheck, Wrap } from "./steps";

export default defineModule<AnatomyState>({
  initialState,
  steps: [
    { id: "story", title: "A taste test in three moves", Component: Recipe },
    { id: "assemble", title: "Assemble a test and run it", Component: Assemble },
    { id: "failure", title: "Reading a failure", Component: ReadFailure },
    { id: "shape", title: "The same shape in every language", Component: SameShape },
    {
      id: "check",
      title: "Which move is it?",
      checkpoint: "testing-anatomy",
      Component: AnatomyCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
