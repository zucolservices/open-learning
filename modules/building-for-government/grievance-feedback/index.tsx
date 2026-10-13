"use client";

import { defineModule } from "@/lib/module-sdk";
import { initialState, type GrievState } from "./state";
import { Book, Month, Cpgrams, Learn, GrievCheck, Wrap } from "./steps";

export default defineModule<GrievState>({
  initialState,
  steps: [
    { id: "story", title: "The complaints book", Component: Book },
    { id: "month", title: "A month of grievances", Component: Month },
    { id: "cpgrams", title: "How India handles grievances", Component: Cpgrams },
    { id: "learn", title: "Closed isn't the same as solved", Component: Learn },
    { id: "check", title: "Grievance or RTI?", checkpoint: "gov-grievance", Component: GrievCheck },
    { id: "wrap", title: "What to remember", Component: Wrap },
  ],
});
