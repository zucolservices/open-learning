"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AcState } from "./state";
import { KeyCard, InvoiceViewer, RealCases, Models, AuthnOrAuthz, Wrap } from "./steps";

export default defineModule<AcState>({
  initialState,
  steps: [
    { id: "story", title: "A guest isn't every guest", Component: KeyCard },
    { id: "viewer", title: "Change one number", Component: InvoiceViewer },
    { id: "cases", title: "It happened at scale", Component: RealCases },
    { id: "models", title: "Writing the rules down", Component: Models },
    {
      id: "check",
      title: "Who are you, or what may you do?",
      checkpoint: "authn-authz",
      Component: AuthnOrAuthz,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
