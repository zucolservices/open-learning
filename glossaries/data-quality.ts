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
  "test-severity": {
    term: "Severity",
    definition:
      "What a failed check should do: warn and carry on, or error and stop what depends on it. Often set with thresholds.",
    module: "severity",
  },
  quarantine: {
    term: "Quarantine",
    definition:
      "Setting rows that fail checks aside in a separate table, so the good rows keep flowing and the bad ones can be fixed and replayed.",
    module: "severity",
  },
  "dead-letter-queue": {
    term: "Dead letter queue",
    definition:
      "A separate place, often a topic or table, where records that couldn't be processed are sent for later inspection.",
    module: "severity",
  },
  "circuit-breaker": {
    term: "Circuit breaker",
    definition:
      "A pattern that stops data flowing downstream when key checks fail, so consumers see a delay rather than wrong data, and resumes once fixed.",
    module: "severity",
  },
  "data-contract": {
    term: "Data contract",
    definition:
      "A written, machine-checkable agreement between a data producer and its consumers covering schema, meaning, quality rules, freshness and ownership.",
    module: "data-contracts",
  },
  "data-producer": {
    term: "Data producer",
    definition:
      "The team or system that creates a dataset, such as the service whose database feeds analytics.",
    module: "data-contracts",
  },
  odcs: {
    term: "Open Data Contract Standard (ODCS)",
    definition:
      "An open, YAML-based standard for data contracts, maintained by Bitol under the Linux Foundation; version 3.2.0 was released in September 2026.",
    module: "data-contracts",
  },
  "schema-evolution": {
    term: "Schema evolution",
    definition:
      "Changing a dataset's or message's schema over time in ways that existing readers and writers can survive.",
    module: "schema-evolution",
  },
  "schema-registry": {
    term: "Schema registry",
    definition:
      "A service that stores every version of a message schema and rejects new versions that break the agreed compatibility rule.",
    module: "schema-evolution",
  },
  "backward-compatibility": {
    term: "Backward compatibility",
    definition:
      "A schema change is backward compatible if readers using the new schema can still read data written with the old one; forward compatibility is the reverse.",
    module: "schema-evolution",
  },
  "data-governance": {
    term: "Data governance",
    definition:
      "Deciding who makes decisions about data, and making sure those decisions are followed: authority, control and shared decision-making over data assets.",
    module: "ownership",
  },
  "data-owner": {
    term: "Data owner",
    definition:
      "The person or, better, team that is accountable for a dataset and approves decisions about it, such as access and breaking changes.",
    module: "ownership",
  },
  "data-steward": {
    term: "Data steward",
    definition:
      "Someone who looks after data day to day: definitions, quality rules and fixing issues. Exact titles vary between frameworks.",
    module: "ownership",
  },
  "data-freshness": {
    term: "Freshness",
    definition:
      "How up to date data is when someone uses it, often measured as the time since the newest record arrived or since the table last updated.",
    module: "data-slas",
  },
  "data-observability": {
    term: "Data observability",
    definition:
      "Watching the data itself (freshness, volume, schema, value distributions and lineage) so problems nobody wrote a test for still surface.",
    module: "data-observability",
  },
  "data-downtime": {
    term: "Data downtime",
    definition:
      "Monte Carlo's term for periods when data is partial, wrong or missing; roughly incidents × (time to detect + time to resolve).",
    module: "data-observability",
  },
  "anomaly-detection": {
    term: "Anomaly detection",
    definition:
      "Learning what normal looks like from a metric's history and flagging values that fall outside the expected range.",
    module: "anomaly-detection",
  },
  seasonality: {
    term: "Seasonality",
    definition:
      "A pattern that repeats on a calendar rhythm, such as quiet weekends or a Monday peak, which a baseline must allow for.",
    module: "anomaly-detection",
  },
  "z-score": {
    term: "Z-score",
    definition:
      "How many standard deviations a value is from the average; monitors often flag values beyond about 3.",
    module: "anomaly-detection",
  },
  "data-lineage": {
    term: "Data lineage",
    definition:
      "A map of where data comes from and where it goes: which jobs read which datasets and write which others, at table or column level.",
    module: "lineage",
  },
  "impact-analysis": {
    term: "Impact analysis",
    definition:
      "Walking lineage downstream from a change or fault to find every dataset, report and team it affects.",
    module: "lineage",
  },
  openlineage: {
    term: "OpenLineage",
    definition:
      "An open standard, under the Linux Foundation's LF AI & Data, for reporting lineage as run events that name a job's inputs and outputs.",
    module: "lineage",
  },
} satisfies Record<string, GlossaryEntry>;
