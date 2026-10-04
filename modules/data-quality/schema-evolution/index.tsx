"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SchemaState } from "./state";
import { Plug, Evolve, Modes, Registries, WhichMode, Wrap } from "./steps";

export default defineModule<SchemaState>({
  initialState,
  steps: [
    { id: "story", title: "The new plug", Component: Plug },
    { id: "evolve", title: "Evolve a schema", Component: Evolve },
    { id: "modes", title: "The compatibility modes", Component: Modes },
    { id: "registries", title: "Registries and tables", Component: Registries },
    { id: "check", title: "Which kind of change?", checkpoint: "which-mode", Component: WhichMode },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
