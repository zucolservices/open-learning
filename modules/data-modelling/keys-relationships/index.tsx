"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type KeyState } from "./state";
import { Lockers, Integrity, ChooseKey, ManyToMany, GoodKey, Wrap } from "./steps";

export default defineModule<KeyState>({
  initialState,
  steps: [
    { id: "story", title: "Numbered lockers", Component: Lockers },
    { id: "integrity", title: "Try to break the links", Component: Integrity },
    { id: "choose", title: "Choosing a primary key", Component: ChooseKey },
    { id: "m2m", title: "Many-to-many", Component: ManyToMany },
    { id: "check", title: "Good key or not?", checkpoint: "good-key", Component: GoodKey },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
