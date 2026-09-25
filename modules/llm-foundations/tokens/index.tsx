"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type TokensState } from "./state";
import {
  LanguageTax,
  LearnBpe,
  Playground,
  PredictRatio,
  Strawberry,
  Vocabularies,
  Wrap,
} from "./steps";

export default defineModule<TokensState>({
  initialState,
  steps: [
    { id: "playground", title: "See what the model sees", Component: Playground },
    { id: "bpe", title: "How the pieces are chosen", Component: LearnBpe },
    {
      id: "ratio",
      title: "Words to tokens",
      checkpoint: "words-to-tokens",
      Component: PredictRatio,
    },
    { id: "languages", title: "The same sentence, a different price", Component: LanguageTax },
    {
      id: "strawberry",
      title: "The strawberry problem",
      checkpoint: "strawberry",
      Component: Strawberry,
    },
    { id: "vocabularies", title: "Vocabularies you'll meet", Component: Vocabularies },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
