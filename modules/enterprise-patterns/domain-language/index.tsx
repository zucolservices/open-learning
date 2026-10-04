"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LangState } from "./state";
import { LostInTranslation, OneWord, InTheCode, ListenWell, SmellOrNot, Wrap } from "./steps";

export default defineModule<LangState>({
  initialState,
  steps: [
    { id: "story", title: "Lost in translation", Component: LostInTranslation },
    { id: "word", title: "One word, five meanings", Component: OneWord },
    { id: "code", title: "The language in the code", Component: InTheCode },
    { id: "listen", title: "Learning from domain experts", Component: ListenWell },
    {
      id: "check",
      title: "Healthy or smelly?",
      checkpoint: "language-smells",
      Component: SmellOrNot,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
