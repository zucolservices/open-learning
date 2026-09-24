"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ShowdownState } from "./state";
import { SameJob } from "./steps-intro";
import { SideBySide, WhoseFile } from "./steps-sim";
import { GrewTogether } from "./steps-story";
import { Catalogs, FeatureMatrix, InteropCheck, OneCopy } from "./steps-compare";
import { ChooseFormat, NewEntrants, Wrap } from "./steps-choose";

export default defineModule<ShowdownState>({
  initialState,
  steps: [
    { id: "same-job", title: "Same job, three designs", Component: SameJob },
    { id: "side-by-side", title: "Side by side", Component: SideBySide },
    {
      id: "whose-file",
      title: "Whose file is it?",
      checkpoint: "whose-file",
      Component: WhoseFile,
    },
    { id: "grew-together", title: "How they grew together", Component: GrewTogether },
    { id: "features", title: "Feature by feature", Component: FeatureMatrix },
    { id: "one-copy", title: "One copy, many formats", Component: OneCopy },
    {
      id: "interop-check",
      title: "Delta writers, Iceberg readers",
      checkpoint: "interop",
      Component: InteropCheck,
    },
    { id: "catalogs", title: "Where the formats meet", Component: Catalogs },
    { id: "choose", title: "Choose a format", Component: ChooseFormat },
    { id: "entrants", title: "Newer entrants", Component: NewEntrants },
    { id: "wrap", title: "Takeaways", Component: Wrap },
  ],
});
