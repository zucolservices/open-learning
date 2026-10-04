import type { GlossaryEntry } from "./types";

/** Data Quality track glossary. `module` slugs refer to this track. */
export const dataQuality = {
  "data-quality": {
    term: "Data quality",
    definition:
      "How well data serves the purposes people use it for: whether it is complete, correct, consistent, timely and so on, for that job.",
    module: "why-quality",
  },
  "fitness-for-use": {
    term: "Fitness for use",
    definition:
      "The classic definition of quality (from Joseph Juran): something is good quality when it meets the needs of the people using it.",
    module: "why-quality",
  },
  "data-consumer": {
    term: "Data consumer",
    definition:
      "A person, report, application or model that uses a dataset, and so depends on its quality.",
    module: "why-quality",
  },
  "hidden-data-factory": {
    term: "Hidden data factory",
    definition:
      "Thomas Redman's name for the unplanned, unrecorded work people do to check, correct and work around bad data.",
    module: "why-quality",
  },
} satisfies Record<string, GlossaryEntry>;
