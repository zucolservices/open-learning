"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ParsingState } from "./state";
import { InkOnPaper, ThreeDocs, Toolbox, WhichFix, Wrap } from "./steps";

export default defineModule<ParsingState>({
  initialState,
  steps: [
    { id: "ink", title: "Ink on paper", Component: InkOnPaper },
    { id: "docs", title: "Three documents, three failures", Component: ThreeDocs },
    { id: "tools", title: "The parsing toolbox", Component: Toolbox },
    { id: "fix", title: "Which fix?", checkpoint: "parse-fix", Component: WhichFix },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
