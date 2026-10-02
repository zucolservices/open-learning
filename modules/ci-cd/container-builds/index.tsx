"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ImageState } from "./state";
import { OrderDockerfile, Sheets, SlimItDown, TagsDigests, Wrap } from "./steps";

export default defineModule<ImageState>({
  initialState,
  steps: [
    { id: "sheets", title: "A stack of transparent sheets", Component: Sheets },
    { id: "slim", title: "Slim it down", Component: SlimItDown },
    { id: "digests", title: "Tags move, digests don't", Component: TagsDigests },
    {
      id: "check",
      title: "Order the Dockerfile",
      checkpoint: "order-dockerfile",
      Component: OrderDockerfile,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
