"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type LinearState } from "./state";
import { Recipe, FitLine, Logistic, Coefficients, WhichModel, Wrap } from "./steps";

export default defineModule<LinearState>({
  initialState,
  steps: [
    { id: "story", title: "A pricing rule of thumb", Component: Recipe },
    { id: "fit", title: "Fit a line, then let gradient descent", Component: FitLine },
    { id: "logistic", title: "Logistic regression for yes or no", Component: Logistic },
    { id: "coefficients", title: "Reading the weights", Component: Coefficients },
    {
      id: "check",
      title: "Linear or logistic?",
      checkpoint: "linear-or-logistic",
      Component: WhichModel,
    },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
