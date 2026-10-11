"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SignState } from "./state";
import { Doors, Methods, Rules, Sessions, SignCheck, Wrap } from "./steps";

export default defineModule<SignState>({
  initialState,
  steps: [
    { id: "story", title: "Keys, fingerprints and a trusted friend", Component: Doors },
    { id: "methods", title: "Sign in five ways, then leak the database", Component: Methods },
    { id: "rules", title: "Today's password rules", Component: Rules },
    { id: "sessions", title: "After sign-in: sessions, tokens and standards", Component: Sessions },
    {
      id: "check",
      title: "Current or outdated?",
      checkpoint: "backend-sign-in",
      Component: SignCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
