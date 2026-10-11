"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CompState } from "./state";
import { Bricks, Props, Tree, Styles, CompCheck, Wrap } from "./steps";

export default defineModule<CompState>({
  initialState,
  steps: [
    { id: "story", title: "Building with bricks", Component: Bricks },
    { id: "props", title: "Decide what a ProductCard needs", Component: Props },
    { id: "tree", title: "A page is a tree of components", Component: Tree },
    { id: "styles", title: "The same component, four ways", Component: Styles },
    {
      id: "check",
      title: "Updating the cart",
      checkpoint: "frontend-components",
      Component: CompCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
