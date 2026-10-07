"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type OauthState } from "./state";
import { ValetKey, Flow, TwoTokens, TokenAttacks, OauthPractice, Wrap } from "./steps";

export default defineModule<OauthState>({
  initialState,
  steps: [
    { id: "story", title: "The valet key", Component: ValetKey },
    { id: "flow", title: "“Sign in with…”, message by message", Component: Flow },
    { id: "tokens", title: "Two tokens, two jobs", Component: TwoTokens },
    { id: "attacks", title: "Stealing tokens, not passwords", Component: TokenAttacks },
    {
      id: "check",
      title: "Good practice or not?",
      checkpoint: "oauth-practice",
      Component: OauthPractice,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
