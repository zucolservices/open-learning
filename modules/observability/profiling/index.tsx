"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ProfState } from "./state";
import { AlwaysOn, Kinds, ReadFlame, WhichNext, Wrap } from "./steps";

export default defineModule<ProfState>({
  initialState,
  steps: [
    { id: "flame", title: "Read the flame graph", Component: ReadFlame },
    { id: "kinds", title: "Kinds of profile", Component: Kinds },
    { id: "always", title: "Always on, in production", Component: AlwaysOn },
    { id: "check", title: "Which signal next?", checkpoint: "profile-next", Component: WhichNext },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
