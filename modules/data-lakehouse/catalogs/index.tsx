"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CatalogState } from "./state";
import { ContactList } from "./steps-intro";
import { SplitBrainCheck, ThreeEngines } from "./steps-connect";
import { Branching, Landscape, RestCheck, RestCommit, Wrap } from "./steps-more";

export default defineModule<CatalogState>({
  initialState,
  steps: [
    { id: "contacts", title: "A contact list for tables", Component: ContactList },
    { id: "engines", title: "Three engines, one table", Component: ThreeEngines },
    {
      id: "two-catalogs",
      title: "Two catalogs, one table",
      checkpoint: "two-catalogs",
      Component: SplitBrainCheck,
    },
    { id: "rest", title: "A commit over REST", Component: RestCommit },
    { id: "landscape", title: "Who's who", Component: Landscape },
    { id: "branching", title: "Branching a catalog", Component: Branching },
    { id: "why-rest", title: "Why a common API", checkpoint: "why-rest", Component: RestCheck },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
