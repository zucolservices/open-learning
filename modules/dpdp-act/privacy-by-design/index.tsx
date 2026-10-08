"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PbdState } from "./state";
import { PipesFirst, Wire, Tools, Backups, PbdCheck, Wrap } from "./steps";

export default defineModule<PbdState>({
  initialState,
  steps: [
    { id: "story", title: "Pipes before plaster", Component: PipesFirst },
    { id: "wire", title: "Wire privacy into the app", Component: Wire },
    { id: "tools", title: "The same patterns, on every platform", Component: Tools },
    { id: "backups", title: "Erasure and the backups", Component: Backups },
    { id: "check", title: "Which job does it do?", checkpoint: "dpdp-pbd", Component: PbdCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
