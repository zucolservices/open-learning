"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UiState } from "./state";
import { PhoneBook, PickIndex, WhenSkipped, WriteCost, HelpsOrNot, Wrap } from "./steps";

export default defineModule<UiState>({
  initialState,
  steps: [
    { id: "book", title: "Sorted by surname", Component: PhoneBook },
    { id: "pick", title: "One index, four queries", Component: PickIndex },
    { id: "skip", title: "When the index is ignored", Component: WhenSkipped },
    { id: "cost", title: "Every index has a price", Component: WriteCost },
    {
      id: "check",
      title: "Will the index help?",
      checkpoint: "helps-or-not",
      Component: HelpsOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
