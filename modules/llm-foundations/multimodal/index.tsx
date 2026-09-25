"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type MmState } from "./state";
import {
  ImageCost,
  OneSpace,
  OrderPipeline,
  PicturesToTokens,
  Pipelines,
  RealModelLooks,
  Wrap,
} from "./steps";

export default defineModule<MmState>({
  initialState,
  steps: [
    { id: "tokens", title: "Pictures become tokens", Component: PicturesToTokens },
    { id: "clip", title: "Pictures and words in one space", Component: OneSpace },
    { id: "vlm", title: "A small model describes the picture", Component: RealModelLooks },
    { id: "cost", title: "What does an image cost?", Component: ImageCost },
    { id: "pipes", title: "Documents, speech and making images", Component: Pipelines },
    {
      id: "order",
      title: "Put the pipeline in order",
      checkpoint: "image-pipeline",
      Component: OrderPipeline,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
