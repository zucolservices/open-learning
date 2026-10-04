"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SqlState } from "./state";
import { TwoDoors, SamePlan, ViewsCatalogs, AnsiMode, WhereVisible, Wrap } from "./steps";

export default defineModule<SqlState>({
  initialState,
  steps: [
    { id: "story", title: "Two front doors", Component: TwoDoors },
    { id: "plan", title: "Different words, same plan", Component: SamePlan },
    { id: "views", title: "Tables, views and catalogs", Component: ViewsCatalogs },
    { id: "ansi", title: "Stricter by default", Component: AnsiMode },
    {
      id: "check",
      title: "Where can you see it?",
      checkpoint: "where-visible",
      Component: WhereVisible,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
