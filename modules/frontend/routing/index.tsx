"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RouteState } from "./state";
import { Book, Browser, Frameworks, NewApis, RouteCheck, Wrap } from "./steps";

export default defineModule<RouteState>({
  initialState,
  steps: [
    { id: "story", title: "A book with page numbers", Component: Book },
    { id: "browser", title: "Navigate the same site three ways", Component: Browser },
    { id: "frameworks", title: "Routes as folders", Component: Frameworks },
    { id: "apis", title: "Newer browser tools for navigation", Component: NewApis },
    {
      id: "check",
      title: "The disappearing Back button",
      checkpoint: "frontend-routing",
      Component: RouteCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
