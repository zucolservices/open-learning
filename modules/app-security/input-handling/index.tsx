"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type InputState } from "./state";
import {
  ParcelCounter,
  Uploads,
  ShapeAndMeaning,
  DangerousParsers,
  GoodValidation,
  Wrap,
} from "./steps";

export default defineModule<InputState>({
  initialState,
  steps: [
    { id: "story", title: "The parcel counter", Component: ParcelCounter },
    { id: "uploads", title: "Guard an upload service", Component: Uploads },
    { id: "shape", title: "Shape, then meaning", Component: ShapeAndMeaning },
    { id: "parsers", title: "Parsers that bite", Component: DangerousParsers },
    {
      id: "check",
      title: "Strong or weak?",
      checkpoint: "validation-strength",
      Component: GoodValidation,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
