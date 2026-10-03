"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type PageState } from "./state";
import { Bookmark, PageThrough, DeepPages, RealApis, WhichPaging, Wrap } from "./steps";

export default defineModule<PageState>({
  initialState,
  steps: [
    { id: "bookmark", title: "A bookmark, not a page number", Component: Bookmark },
    { id: "page", title: "Page through a changing list", Component: PageThrough },
    { id: "deep", title: "Page 1,000 is slow", Component: DeepPages },
    { id: "real", title: "How real APIs do it", Component: RealApis },
    { id: "check", title: "Pick the paging", checkpoint: "which-paging", Component: WhichPaging },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
