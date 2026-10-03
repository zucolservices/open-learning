"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AuthState } from "./state";
import { ValetKey, OAuthFlow, InspectToken, Credentials, WhichCredential, Wrap } from "./steps";

export default defineModule<AuthState>({
  initialState,
  steps: [
    { id: "valet", title: "The valet key", Component: ValetKey },
    { id: "flow", title: "Sign in with PKCE", Component: OAuthFlow },
    { id: "token", title: "Inspect the token", Component: InspectToken },
    { id: "creds", title: "Keys, tokens and certificates", Component: Credentials },
    {
      id: "check",
      title: "Which credential?",
      checkpoint: "which-credential",
      Component: WhichCredential,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
