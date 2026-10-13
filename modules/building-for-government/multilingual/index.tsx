"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LangState } from "./state";
import { Signboard, Localise, Scripts, Bhashini, LangCheck, Wrap } from "./steps";

export default defineModule<LangState>({
  initialState,
  steps: [
    { id: "story", title: "The railway station board", Component: Signboard },
    { id: "localise", title: "Localise the form", Component: Localise },
    { id: "scripts", title: "Languages, scripts and the law", Component: Scripts },
    { id: "bhashini", title: "Translation at scale", Component: Bhashini },
    {
      id: "check",
      title: "Fine, or will it break?",
      checkpoint: "gov-languages",
      Component: LangCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
