"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SecurityState } from "./state";
import { HiddenNote, Intern, Layers, PersonalData, SalaryLeak, Wrap } from "./steps";

export default defineModule<SecurityState>({
  initialState,
  steps: [
    { id: "intern", title: "The intern with the keys", Component: Intern },
    { id: "leak", title: "The salary leak", Component: SalaryLeak },
    { id: "note", title: "The hidden note", Component: HiddenNote },
    { id: "personal", title: "Personal data", Component: PersonalData },
    {
      id: "layers",
      title: "Enforced, or just asked?",
      checkpoint: "enforced-or-asked",
      Component: Layers,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
