"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DoState } from "./state";
import { SharedSheet, Untangle, Golden, Mesh, WhoOwns, Wrap } from "./steps";

export default defineModule<DoState>({
  initialState,
  steps: [
    { id: "story", title: "One spreadsheet for everyone", Component: SharedSheet },
    { id: "untangle", title: "Untangle a shared database", Component: Untangle },
    { id: "golden", title: "The golden customer record", Component: Golden },
    { id: "mesh", title: "Data mesh, for analytics", Component: Mesh },
    { id: "check", title: "Where should it live?", checkpoint: "who-owns", Component: WhoOwns },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
