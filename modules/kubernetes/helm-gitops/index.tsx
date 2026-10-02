"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GitOpsState } from "./state";
import { GitOpsLoop, OneRecipe, PackageIt, WhichTool, Wrap } from "./steps";

export default defineModule<GitOpsState>({
  initialState,
  steps: [
    { id: "recipe", title: "One recipe, many kitchens", Component: OneRecipe },
    { id: "package", title: "Package it", Component: PackageIt },
    { id: "loop", title: "The GitOps loop", Component: GitOpsLoop },
    { id: "check", title: "Which tool?", checkpoint: "which-delivery-tool", Component: WhichTool },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
