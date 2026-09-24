"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type FormatsState } from "./state";
import { Flatten } from "./steps-basics";
import { Journey } from "./steps-story";
import { Compression, GzipCheck, QueryReads, WhichFormat, Workers } from "./steps-analysis";
import { CheatSheet, Wrap } from "./steps-wrap";

export default defineModule<FormatsState>({
  initialState,
  steps: [
    { id: "flatten", title: "A file is a line of bytes", Component: Flatten },
    { id: "journey", title: "The journey of order #88213", Component: Journey },
    { id: "reads", title: "What a query reads", Component: QueryReads },
    { id: "compress", title: "Why columns compress better", Component: Compression },
    {
      id: "which",
      title: "Which format fits?",
      checkpoint: "which-format",
      Component: WhichFormat,
    },
    { id: "workers", title: "Many workers, one file", Component: Workers },
    { id: "gzip", title: "The slow nightly job", checkpoint: "gzip-split", Component: GzipCheck },
    { id: "cheatsheet", title: "Cheat sheet", Component: CheatSheet },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
