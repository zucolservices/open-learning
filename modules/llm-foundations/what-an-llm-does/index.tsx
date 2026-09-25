"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LlmState } from "./state";
import { Autocomplete } from "./steps-story";
import { BeTheModel, ChatDocument, NotADatabase, SameQuestion, Timeline, Wrap } from "./steps";

export default defineModule<LlmState>({
  initialState,
  steps: [
    { id: "autocomplete", title: "From autocomplete to assistant", Component: Autocomplete },
    { id: "be-the-model", title: "Be the model", Component: BeTheModel },
    {
      id: "different",
      title: "Same question, different answer",
      checkpoint: "different-answers",
      Component: SameQuestion,
    },
    { id: "chat", title: "A chat is just a document", Component: ChatDocument },
    {
      id: "database",
      title: "Where do its answers come from?",
      checkpoint: "not-a-database",
      Component: NotADatabase,
    },
    { id: "timeline", title: "How we got here", Component: Timeline },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
