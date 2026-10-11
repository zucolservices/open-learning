"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ImgState } from "./state";
import { Poster, FixPage, Formats, Fonts, ImgCheck, Wrap } from "./steps";

export default defineModule<ImgState>({
  initialState,
  steps: [
    { id: "story", title: "Posting a billboard to a phone box", Component: Poster },
    { id: "fix", title: "Lighten a product page", Component: FixPage },
    { id: "formats", title: "Formats and sizes", Component: Formats },
    { id: "fonts", title: "Fonts without the flash", Component: Fonts },
    {
      id: "check",
      title: "Which image shouldn't be lazy?",
      checkpoint: "frontend-images",
      Component: ImgCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
