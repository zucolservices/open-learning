"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TypesState } from "./state";
import { Form, Redesign, Slogans, Support, TypesCheck, Wrap } from "./steps";

export default defineModule<TypesState>({
  initialState,
  steps: [
    { id: "story", title: "A form that can't be filled in wrong", Component: Form },
    { id: "redesign", title: "Make impossible orders impossible to write", Component: Redesign },
    { id: "slogans", title: "Two slogans worth remembering", Component: Slogans },
    { id: "support", title: "Your language probably supports this", Component: Support },
    {
      id: "check",
      title: "Can the type prevent it?",
      checkpoint: "clean-types",
      Component: TypesCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
