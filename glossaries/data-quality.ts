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
  "dq-dimension": {
    term: "Data quality dimension",
    definition:
      "One measurable aspect of data quality, such as completeness or timeliness, usually reported as a percentage or a delay.",
    module: "quality-dimensions",
  },
  completeness: {
    term: "Completeness",
    definition:
      "Whether all the values that should be present are present, measured as the share of required values that aren't blank.",
    module: "quality-dimensions",
  },
  validity: {
    term: "Validity",
    definition:
      "Whether values follow their rules: the right format, type and range. A valid value can still be wrong.",
    module: "quality-dimensions",
  },
  accuracy: {
    term: "Accuracy",
    definition:
      "Whether data correctly describes the real thing. Checking it needs an outside reference, such as the real object or a trusted list.",
    module: "quality-dimensions",
  },
  timeliness: {
    term: "Timeliness",
    definition:
      "Whether data is up to date enough for when it's needed, measured as the delay between an event and the data showing it.",
    module: "quality-dimensions",
  },
} satisfies Record<string, GlossaryEntry>;
