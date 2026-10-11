"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UndoState } from "./state";
import { ThreeUndos, PickUndo, ResetModes, BeforeAfter, UndoCheck, Wrap } from "./steps";

export default defineModule<UndoState>({
  initialState,
  steps: [
    { id: "story", title: "Three kinds of undo", Component: ThreeUndos },
    { id: "pick", title: "Pick the right undo", Component: PickUndo },
    { id: "reset", title: "What git reset touches", Component: ResetModes },
    { id: "push", title: "Before pushing, or after?", Component: BeforeAfter },
    { id: "check", title: "Safe after pushing?", checkpoint: "git-undoing", Component: UndoCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
