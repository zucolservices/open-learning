"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type RolesState } from "./state";
import { Keys, TagTheOrder, PurposeAndMeans, WhoAnswers, RoleCheck, Wrap } from "./steps";

export default defineModule<RolesState>({
  initialState,
  steps: [
    { id: "story", title: "Who holds the keys?", Component: Keys },
    { id: "tag", title: "Tag everyone in one food order", Component: TagTheOrder },
    { id: "means", title: "Same vendor, different role", Component: PurposeAndMeans },
    { id: "answers", title: "When the vendor slips, who answers?", Component: WhoAnswers },
    { id: "check", title: "Name the role", checkpoint: "dpdp-roles", Component: RoleCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
