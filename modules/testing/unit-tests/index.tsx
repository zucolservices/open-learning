"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UnitState } from "./state";
import { Bench, BuildSuite, WhatUnit, First, UnitCheck, Wrap } from "./steps";

export default defineModule<UnitState>({
  initialState,
  steps: [
    { id: "story", title: "Test the bulb on the bench", Component: Bench },
    { id: "suite", title: "Build a suite that catches every bug", Component: BuildSuite },
    { id: "unit", title: "What counts as a unit?", Component: WhatUnit },
    { id: "first", title: "Good unit tests are FIRST", Component: First },
    { id: "check", title: "Unit test or not?", checkpoint: "testing-unit", Component: UnitCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
