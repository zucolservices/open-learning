"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StructState } from "./state";
import { Kitchen, Untangle, Rings, Folders, StructCheck, Wrap } from "./steps";

export default defineModule<StructState>({
  initialState,
  steps: [
    { id: "story", title: "The one-person café", Component: Kitchen },
    { id: "untangle", title: "Untangle a 400-line handler", Component: Untangle },
    { id: "rings", title: "Rules in the middle, technology at the edge", Component: Rings },
    { id: "folders", title: "Folders by layer, or by feature?", Component: Folders },
    {
      id: "check",
      title: "A dependency pointing the wrong way",
      checkpoint: "backend-structure",
      Component: StructCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
