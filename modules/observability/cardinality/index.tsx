"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type CardState } from "./state";
import { LabelOrNot, OneTooMany, WhereDetail, Wrap } from "./steps";

export default defineModule<CardState>({
  initialState,
  steps: [
    { id: "labels", title: "One label too many", Component: OneTooMany },
    { id: "detail", title: "Where the detail belongs", Component: WhereDetail },
    { id: "check", title: "Label or not?", checkpoint: "label-or-not", Component: LabelOrNot },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
