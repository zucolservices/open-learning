"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type UpState } from "./state";
import { Parcels, FixUploads, Flow, Serve, UpCheck, Wrap } from "./steps";

export default defineModule<UpState>({
  initialState,
  steps: [
    { id: "story", title: "The parcel room", Component: Parcels },
    { id: "fix", title: "Harden a photo upload", Component: FixUploads },
    { id: "flow", title: "Uploading straight to storage", Component: Flow },
    { id: "serve", title: "Scanning, serving and cleaning up", Component: Serve },
    {
      id: "check",
      title: "What is this file, really?",
      checkpoint: "backend-uploads",
      Component: UpCheck,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
