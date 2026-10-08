"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CapState } from "./state";
import { Memo, Audit, Drill, AlreadyToday, Checklist, CapCheck, Wrap } from "./steps";

export default defineModule<CapState>({
  initialState,
  steps: [
    { id: "story", title: "“Ready by May 2027”", Component: Memo },
    { id: "audit", title: "Audit PadhaiPal", Component: Audit },
    { id: "drill", title: "The breach drill", Component: Drill },
    { id: "today", title: "What already applies today", Component: AlreadyToday },
    { id: "checklist", title: "The whole track as a checklist", Component: Checklist },
    {
      id: "check",
      title: "Which chapter fixes it?",
      checkpoint: "dpdp-capstone",
      Component: CapCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
