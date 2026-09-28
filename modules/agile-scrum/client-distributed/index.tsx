"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type ClientState } from "./state";
import { Clocks, FiveMoments, OverlapGuess, Tailor, Wrap } from "./steps";

export default defineModule<ClientState>({
  initialState,
  steps: [
    { id: "tailor", title: "A suit made far away", Component: Tailor },
    {
      id: "guess",
      title: "Guess the overlap",
      checkpoint: "overlap-guess",
      Component: OverlapGuess,
    },
    { id: "clocks", title: "Two clocks", Component: Clocks },
    { id: "moments", title: "Five moments", Component: FiveMoments },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
