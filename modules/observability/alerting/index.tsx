"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AlertState } from "./state";
import { DeservesPage, PageOrTicket, Router, WeekOfPages, Wrap } from "./steps";

export default defineModule<AlertState>({
  initialState,
  steps: [
    { id: "week", title: "A week of pages", Component: WeekOfPages },
    { id: "deserves", title: "What deserves a page", Component: DeservesPage },
    { id: "router", title: "Between the rule and the phone", Component: Router },
    {
      id: "check",
      title: "Page, ticket or neither?",
      checkpoint: "page-or-ticket",
      Component: PageOrTicket,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
