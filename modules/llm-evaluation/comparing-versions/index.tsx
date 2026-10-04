"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CompareState } from "./state";
import { TasteTest, AvsB, ManyTries, WinRates, HonestOrNot, Wrap } from "./steps";

export default defineModule<CompareState>({
  initialState,
  steps: [
    { id: "story", title: "A fair taste test", Component: TasteTest },
    { id: "a-vs-b", title: "A versus B, honestly", Component: AvsB },
    { id: "many", title: "Try enough variants and one will “win”", Component: ManyTries },
    { id: "win-rates", title: "Win rates and ties", Component: WinRates },
    {
      id: "check",
      title: "Honest or fooling yourself?",
      checkpoint: "honest-or-not",
      Component: HonestOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
