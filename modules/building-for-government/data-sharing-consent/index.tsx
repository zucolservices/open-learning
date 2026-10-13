"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ShareState } from "./state";
import { Relay, Connect, Consent, Basis, ShareCheck, Wrap } from "./steps";

export default defineModule<ShareState>({
  initialState,
  steps: [
    { id: "story", title: "Ask once", Component: Relay },
    { id: "connect", title: "Connect three departments", Component: Connect },
    { id: "consent", title: "Consent as infrastructure", Component: Consent },
    { id: "basis", title: "The legal basis, and other countries", Component: Basis },
    {
      id: "check",
      title: "Is yes or no enough?",
      checkpoint: "gov-data-sharing",
      Component: ShareCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
