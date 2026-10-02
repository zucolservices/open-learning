"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SchemaState } from "./state";
import { AllowedOrNot, BreakAndFix, Form, Formats, WireFormat, Wrap } from "./steps";

export default defineModule<SchemaState>({
  initialState,
  steps: [
    { id: "form", title: "Changing a printed form", Component: Form },
    { id: "break", title: "Break a consumer, then fix it", Component: BreakAndFix },
    { id: "wire", title: "How a registry works", Component: WireFormat },
    { id: "formats", title: "Formats and registries", Component: Formats },
    {
      id: "check",
      title: "Allowed under BACKWARD?",
      checkpoint: "backward-allowed",
      Component: AllowedOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
