"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ContextState } from "./state";
import { Desk } from "./steps-story";
import {
  FillTheWindow,
  LongConversations,
  LostInTheMiddle,
  MoreTextMoreMistakes,
  StableFirst,
  WhereItLives,
  Wrap,
} from "./steps";

export default defineModule<ContextState>({
  initialState,
  steps: [
    { id: "desk", title: "The consultant's desk", Component: Desk },
    { id: "fill", title: "Fill the window", Component: FillTheWindow },
    { id: "middle", title: "Lost in the middle", Component: LostInTheMiddle },
    { id: "more", title: "More text, more mistakes", Component: MoreTextMoreMistakes },
    { id: "memory", title: "Remembering a long conversation", Component: LongConversations },
    { id: "cache", title: "Stable parts first", Component: StableFirst },
    { id: "where", title: "Where should it live?", checkpoint: "where", Component: WhereItLives },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
