"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CsrfState } from "./state";
import { LoyaltyCard, ForgedTransfer, Origins, CorsExplained, StopsCsrf, Wrap } from "./steps";

export default defineModule<CsrfState>({
  initialState,
  steps: [
    { id: "story", title: "Someone else's order slip", Component: LoyaltyCard },
    { id: "forge", title: "Forge a transfer", Component: ForgedTransfer },
    { id: "origins", title: "What counts as the same site?", Component: Origins },
    { id: "cors", title: "What CORS does, and doesn't", Component: CorsExplained },
    { id: "check", title: "Does it stop CSRF?", checkpoint: "stops-csrf", Component: StopsCsrf },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
