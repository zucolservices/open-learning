"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ParquetState } from "./state";
import { ReadingOrder, Zoom } from "./steps-intro";
import { Skipping, SortingCheck } from "./steps-skipping";
import { Codecs, Encodings, Nested, ReadOrderCheck, Wrap } from "./steps-encoding";

export default defineModule<ParquetState>({
  initialState,
  steps: [
    { id: "book", title: "A book with the index at the back", Component: ReadingOrder },
    { id: "zoom", title: "Zoom into a Parquet file", Component: Zoom },
    { id: "skipping", title: "Skip what you don't need", Component: Skipping },
    {
      id: "why-sorting",
      title: "Why sorting mattered",
      checkpoint: "why-sorting",
      Component: SortingCheck,
    },
    { id: "encodings", title: "Encodings per column", Component: Encodings },
    { id: "codecs", title: "Codecs: speed vs size", Component: Codecs },
    { id: "nested", title: "Deep dive: nested data", Component: Nested },
    {
      id: "read-order",
      title: "Read like an engine",
      checkpoint: "read-order",
      Component: ReadOrderCheck,
    },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
