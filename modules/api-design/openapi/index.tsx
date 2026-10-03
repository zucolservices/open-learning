"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OasState } from "./state";
import { Blueprint, BuildSpec, DesignFirst, Timeline, GeneratedOrNot, Wrap } from "./steps";

export default defineModule<OasState>({
  initialState,
  steps: [
    { id: "blueprint", title: "Drawings before bricks", Component: Blueprint },
    { id: "build", title: "Write the contract", Component: BuildSpec },
    { id: "first", title: "Design first or code first", Component: DesignFirst },
    { id: "history", title: "From Swagger to 3.2", Component: Timeline },
    {
      id: "check",
      title: "Generated or not?",
      checkpoint: "generated-or-not",
      Component: GeneratedOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
