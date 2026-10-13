"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type StoreState } from "./state";
import { Kitchen, Choose, Protect, Backups, StoreCheck, Wrap } from "./steps";

export default defineModule<StoreState>({
  initialState,
  steps: [
    { id: "story", title: "A place for everything", Component: Kitchen },
    { id: "choose", title: "Where does it go?", Component: Choose },
    { id: "protect", title: "Keeping secrets secret", Component: Protect },
    { id: "backups", title: "Backups and new phones", Component: Backups },
    {
      id: "check",
      title: "The token in the settings file",
      checkpoint: "mobile-storage",
      Component: StoreCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
