"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type DeliveryState } from "./state";
import { AuditorQuestion, Regulated, WhereHuman, Wrap } from "./steps";

export default defineModule<DeliveryState>({
  initialState,
  steps: [
    { id: "human", title: "Where does the human go?", Component: WhereHuman },
    { id: "regulated", title: "Regulated, and still continuous", Component: Regulated },
    {
      id: "check",
      title: "The auditor's question",
      checkpoint: "auditor-question",
      Component: AuditorQuestion,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
