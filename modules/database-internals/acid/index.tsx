"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type AcidState } from "./state";
import { FourPromises } from "./steps-story";
import { TryTransfer, InSql, BeyondOne, WhichLetter, Wrap } from "./steps";

export default defineModule<AcidState>({
  initialState,
  steps: [
    { id: "story", title: "Four promises", Component: FourPromises },
    { id: "try", title: "A transfer that fails halfway", Component: TryTransfer },
    { id: "sql", title: "Transactions in SQL", Component: InSql },
    { id: "beyond", title: "Beyond one database", Component: BeyondOne },
    { id: "check", title: "Which promise?", checkpoint: "which-letter", Component: WhichLetter },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
