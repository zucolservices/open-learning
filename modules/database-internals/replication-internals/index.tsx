"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ReplState } from "./state";
import {
  ChessByPost,
  CommitLevels,
  PhysLogical,
  GoesWrong,
  MysqlAurora,
  PickLevel,
  Wrap,
} from "./steps";

export default defineModule<ReplState>({
  initialState,
  steps: [
    { id: "story", title: "Chess by post", Component: ChessByPost },
    { id: "commit", title: "How long should a commit wait?", Component: CommitLevels },
    { id: "kinds", title: "Physical and logical", Component: PhysLogical },
    { id: "wrong", title: "What goes wrong", Component: GoesWrong },
    { id: "others", title: "MySQL and Aurora", Component: MysqlAurora },
    { id: "check", title: "Pick the level", checkpoint: "pick-commit-level", Component: PickLevel },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
