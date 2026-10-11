"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MonoState } from "./state";
import { OneKitchen, OneChange, Submodules, Tooling, MonoCheck, Wrap } from "./steps";

export default defineModule<MonoState>({
  initialState,
  steps: [
    { id: "story", title: "One big kitchen, or five small ones?", Component: OneKitchen },
    { id: "change", title: "One change, two shapes", Component: OneChange },
    {
      id: "submodules",
      title: "Submodules: a repository inside a repository",
      Component: Submodules,
    },
    { id: "tools", title: "What makes monorepos work", Component: Tooling },
    {
      id: "check",
      title: "Monorepo, polyrepo or submodule?",
      checkpoint: "git-monorepos",
      Component: MonoCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
