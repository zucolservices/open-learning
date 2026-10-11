"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CacheState } from "./state";
import { Bakery, Headers, Words, Cdns, CacheCheck, Wrap } from "./steps";

export default defineModule<CacheState>({
  initialState,
  steps: [
    { id: "story", title: "The bakery, the corner shop and your cupboard", Component: Bakery },
    { id: "headers", title: "Set the cache header for each response", Component: Headers },
    { id: "words", title: "What the words mean", Component: Words },
    { id: "cdns", title: "CDNs don't all behave alike", Component: Cdns },
    { id: "check", title: "Safe to share?", checkpoint: "frontend-caching", Component: CacheCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
