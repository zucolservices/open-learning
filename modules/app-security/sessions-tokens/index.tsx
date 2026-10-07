"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SessState } from "./state";
import { Cloakroom, StealSession, Jwt, WhereToKeep, CookieChoices, Wrap } from "./steps";

export default defineModule<SessState>({
  initialState,
  steps: [
    { id: "story", title: "The cloakroom ticket", Component: Cloakroom },
    { id: "steal", title: "Five ways to lose a session", Component: StealSession },
    { id: "jwt", title: "Inside a JSON Web Token", Component: Jwt },
    { id: "store", title: "Where should a token live?", Component: WhereToKeep },
    {
      id: "check",
      title: "Strong or weak setting?",
      checkpoint: "session-settings",
      Component: CookieChoices,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
