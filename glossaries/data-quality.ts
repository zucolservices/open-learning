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
  "data-test": {
    term: "Data test",
    definition:
      "An automatic check on real data, such as 'every order has a customer', that runs after data loads and fails when the rule is broken.",
    module: "data-tests",
  },
  assertion: {
    term: "Assertion",
    definition:
      "A statement that must be true, checked automatically. A data test asserts something about rows in a table.",
    module: "data-tests",
  },
  "generic-test": {
    term: "Generic test",
    definition:
      "A reusable, parameterised data test attached to columns, such as dbt's unique, not_null, accepted_values and relationships.",
    module: "data-tests",
  },
  "data-profiling": {
    term: "Data profiling",
    definition:
      "Computing facts about a dataset (nulls, distinct values, ranges, patterns, relationships) to learn what it really contains before trusting or testing it.",
    module: "profiling",
  },
  "constraint-suggestion": {
    term: "Constraint suggestion",
    definition:
      "Proposing data quality rules automatically from a profile. Suggestions must be reviewed, because they assume the data they came from was correct.",
    module: "profiling",
  },
  "validation-framework": {
    term: "Validation framework",
    definition:
      "A tool where you declare rules about data and it runs the checks and reports results, such as Great Expectations, Soda, Deequ or pandera.",
    module: "expectations",
  },
  expectation: {
    term: "Expectation",
    definition:
      "A declared rule about data, such as 'amount is never negative'. Great Expectations' name for a single check.",
    module: "expectations",
  },
  "write-audit-publish": {
    term: "Write-Audit-Publish (WAP)",
    definition:
      "Writing new data where consumers can't see it, checking it, and only then making it visible. Popularised by Netflix in 2017.",
    module: "where-to-test",
  },
  "shift-left": {
    term: "Shift left",
    definition:
      "Moving checks earlier in a process, where problems are cheaper to fix and haven't yet reached users.",
    module: "where-to-test",
  },
  "data-branch": {
    term: "Data branch",
    definition:
      "A git-like branch of a table or lake, such as in Apache Iceberg or lakeFS, where changes can be made and checked before merging.",
    module: "where-to-test",
  },
} satisfies Record<string, GlossaryEntry>;
