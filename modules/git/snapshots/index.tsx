"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type SnapState } from "./state";
import { PhotoAlbum, BuildCommit, SecondSnapshot, TheHash, SnapCheck, Wrap } from "./steps";

export default defineModule<SnapState>({
  initialState,
  steps: [
    { id: "story", title: "Photos, not a diary", Component: PhotoAlbum },
    { id: "build", title: "Build a commit by hand", Component: BuildCommit },
    { id: "second", title: "The second snapshot", Component: SecondSnapshot },
    { id: "hash", title: "A fingerprint for every object", Component: TheHash },
    { id: "check", title: "True or false?", checkpoint: "git-snapshots", Component: SnapCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
