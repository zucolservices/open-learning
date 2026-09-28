"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type KanbanState } from "./state";
import { Board, Highway, KanbanGuide, Littles, KanbanMyths, Wrap } from "./steps";

export default defineModule<KanbanState>({
  initialState,
  steps: [
    { id: "highway", title: "Rush hour", Component: Highway },
    { id: "guide", title: "Kanban in three practices", Component: KanbanGuide },
    { id: "board", title: "Run the board", Component: Board },
    { id: "littles", title: "Little's Law", checkpoint: "littles", Component: Littles },
    { id: "myths", title: "Kanban or myth?", checkpoint: "kanban-myths", Component: KanbanMyths },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
