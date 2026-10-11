"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FormatState } from "./state";
import { Menu, FormatLint, Tools, Guides, FormatCheck, Wrap } from "./steps";

export default defineModule<FormatState>({
  initialState,
  steps: [
    { id: "story", title: "One menu, one layout", Component: Menu },
    { id: "format", title: "Let the tools take the review comments", Component: FormatLint },
    { id: "tools", title: "A formatter and a linter in every language", Component: Tools },
    { id: "guides", title: "What tools can't settle", Component: Guides },
    {
      id: "check",
      title: "Tool or human?",
      checkpoint: "clean-formatting",
      Component: FormatCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
