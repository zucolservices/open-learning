"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Complaint, Evidence, Prioritise, Everyone, Prove, CapCheck, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "“The product page is awful on my phone”", Component: Complaint },
    { id: "evidence", title: "Read the evidence", Component: Evidence },
    { id: "prioritise", title: "Three fixes this sprint", Component: Prioritise },
    { id: "everyone", title: "Fast for everyone, safe for everyone", Component: Everyone },
    { id: "prove", title: "Prove it worked", Component: Prove },
    {
      id: "check",
      title: "The performance workflow",
      checkpoint: "frontend-capstone",
      Component: CapCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
