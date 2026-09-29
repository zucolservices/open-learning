"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GraphState } from "./state";
import {
  AnswerFromMap,
  BigQuestion,
  BuildGraph,
  LocalGlobal,
  WhichTool,
  WorthIt,
  Wrap,
} from "./steps";

export default defineModule<GraphState>({
  initialState,
  steps: [
    { id: "questions", title: "Two kinds of question", Component: LocalGlobal },
    { id: "big", title: "Plain RAG on a big question", Component: BigQuestion },
    { id: "build", title: "Build the map", Component: BuildGraph },
    { id: "answer", title: "Answer from the map", Component: AnswerFromMap },
    { id: "worth", title: "Is it worth it?", Component: WorthIt },
    { id: "which", title: "Which tool?", checkpoint: "graph-or-rag", Component: WhichTool },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
