import type { GlossaryEntry } from "./types";

/** Data Modelling track glossary. `module` slugs refer to this track. */
export const dataModelling = {
  "data-model": {
    term: "Data model",
    definition:
      "An agreed description of what data a system holds: the things it records, what is known about each, how they connect, and the rules they follow.",
    module: "why-model",
  },
  entity: {
    term: "Entity",
    definition:
      "A kind of thing a model records information about, such as a customer, product or order.",
    module: "why-model",
  },
  attribute: {
    term: "Attribute",
    definition:
      "A single fact recorded about an entity, such as a customer's name or an order's date. Usually a column.",
    module: "why-model",
  },
  "operational-data": {
    term: "Operational data",
    definition:
      "Data used to run the business day to day: recording and changing individual orders, payments or bookings as they happen.",
    module: "why-model",
  },
  "analytical-data": {
    term: "Analytical data",
    definition:
      "Data organised to understand the business: summarising lots of history to spot trends, compare periods and answer questions.",
    module: "why-model",
  },
  "conceptual-model": {
    term: "Conceptual model",
    definition:
      "The highest-level model: the things a business cares about and how they relate, in its own words, with no technical detail.",
    module: "model-levels",
  },
  "logical-model": {
    term: "Logical model",
    definition:
      "A detailed model listing every entity, attribute, key and relationship, without tying it to a particular database product.",
    module: "model-levels",
  },
  "physical-model": {
    term: "Physical model",
    definition:
      "The model as built in one database: tables, column types, constraints, indexes and other product-specific choices.",
    module: "model-levels",
  },
  "er-diagram": {
    term: "Entity-relationship diagram",
    definition:
      "A drawing of a data model with entities as boxes and relationships as lines between them. Introduced by Peter Chen in 1976.",
    module: "model-levels",
  },
  cardinality: {
    term: "Cardinality",
    definition:
      "How many of one thing can relate to another: one-to-one, one-to-many or many-to-many.",
    module: "model-levels",
  },
  "crows-foot": {
    term: "Crow's foot notation",
    definition:
      "A style of ER diagram where a three-pronged 'foot' at the end of a line means 'many' and a bar means 'one'.",
    module: "model-levels",
  },
  "primary-key": {
    term: "Primary key",
    definition:
      "The column or columns that uniquely identify each row of a table. Values must be unique and never empty; a table has at most one.",
    module: "keys-relationships",
  },
  "foreign-key": {
    term: "Foreign key",
    definition:
      "A column whose values must match a key in another table, linking each row to the row it refers to.",
    module: "keys-relationships",
  },
  "referential-integrity": {
    term: "Referential integrity",
    definition:
      "The guarantee that every foreign key points to a row that actually exists, so there are no orphaned references.",
    module: "keys-relationships",
  },
  "candidate-key": {
    term: "Candidate key",
    definition:
      "Any smallest set of columns that uniquely identifies each row. One is chosen as the primary key.",
    module: "keys-relationships",
  },
  "natural-key": {
    term: "Natural key",
    definition:
      "A key that comes from the real world and means something, such as an ISBN, an email address or a product code.",
    module: "keys-relationships",
  },
  "surrogate-key": {
    term: "Surrogate key",
    definition:
      "A meaningless generated identifier, usually an increasing integer, used instead of a natural key.",
    module: "keys-relationships",
  },
  "junction-table": {
    term: "Junction table",
    definition:
      "A table that resolves a many-to-many relationship, holding a foreign key to each side. Also called an associative, link or bridge table.",
    module: "keys-relationships",
  },
  "composite-key": {
    term: "Composite key",
    definition: "A key made of more than one column, such as (order_id, product_no).",
    module: "keys-relationships",
  },
  normalisation: {
    term: "Normalisation",
    definition:
      "Arranging tables so each fact is stored in one place, following a series of normal forms, to stop repeated data drifting out of step.",
    module: "normalisation",
  },
  "normal-form": {
    term: "Normal form",
    definition:
      "One of a series of rules a table can satisfy (first, second, third, Boyce–Codd…), each removing a kind of redundancy.",
    module: "normalisation",
  },
  "data-anomaly": {
    term: "Anomaly (update, insert, delete)",
    definition:
      "A problem caused by redundant data: a repeated fact updated in only some places, a fact that can't be stored on its own, or one lost when another is deleted.",
    module: "normalisation",
  },
  "functional-dependency": {
    term: "Functional dependency",
    definition: "When knowing one value fixes another: knowing the product tells you its price.",
    module: "normalisation",
  },
  bcnf: {
    term: "Boyce–Codd normal form (BCNF)",
    definition:
      "A slightly stricter third normal form (1974): every column that determines another must be a candidate key.",
    module: "normalisation",
  },
  oltp: {
    term: "OLTP",
    definition:
      "Online transaction processing: systems that record and update individual transactions, such as orders and payments, quickly and reliably.",
    module: "oltp-olap",
  },
  olap: {
    term: "OLAP",
    definition:
      "Online analytical processing: systems built to group and summarise large amounts of data from many angles. The term was coined by E. F. Codd and colleagues in 1993.",
    module: "oltp-olap",
  },
  denormalisation: {
    term: "Denormalisation",
    definition:
      "Deliberately repeating data, such as copying a product's category onto every sale, so reads need fewer joins. Writes then have more copies to keep in step.",
    module: "oltp-olap",
  },
  etl: {
    term: "ETL / ELT",
    definition:
      "Extract, transform, load: copying data out of source systems, reshaping it and loading it into an analytical store. ELT loads first and transforms inside the warehouse.",
    module: "oltp-olap",
  },
  fact: {
    term: "Fact",
    definition:
      "A number measured by a business event, such as quantity sold or sale amount. Facts are usually added up.",
    module: "star-schema",
  },
  "fact-table": {
    term: "Fact table",
    definition:
      "The central table of a dimensional model: one row per measured event, holding numeric facts and a foreign key to each dimension.",
    module: "star-schema",
  },
  "dimension-table": {
    term: "Dimension table",
    definition:
      "A table describing the context of events (who, what, where, when), usually wide and flat with descriptive text used to filter and group.",
    module: "star-schema",
  },
  "star-schema": {
    term: "Star schema",
    definition:
      "A dimensional model in a relational database: a fact table in the centre joined by keys to the dimension tables around it.",
    module: "star-schema",
  },
  grain: {
    term: "Grain",
    definition:
      "Exactly what one row of a fact table represents, such as one item scanned on a receipt. Declared before choosing dimensions or facts.",
    module: "grain",
  },
  "atomic-grain": {
    term: "Atomic grain",
    definition:
      "The lowest level of detail a business process captures. Starting there lets any later question be answered.",
    module: "grain",
  },
  "degenerate-dimension": {
    term: "Degenerate dimension",
    definition:
      "A dimension key with no table of its own, such as a receipt or order number stored directly on the fact row.",
    module: "grain",
  },
  "business-process": {
    term: "Business process",
    definition:
      "An operational activity that produces measurements, such as taking an order or processing a claim. Each fact table usually models one.",
    module: "grain",
  },
  "transaction-fact": {
    term: "Transaction fact table",
    definition:
      "A fact table with one row per measurement event, added when it happens and never changed.",
    module: "fact-tables",
  },
  "periodic-snapshot": {
    term: "Periodic snapshot",
    definition:
      "A fact table with one row per thing per period (day, week, month), such as a balance or stock level, even when nothing happened.",
    module: "fact-tables",
  },
  "accumulating-snapshot": {
    term: "Accumulating snapshot",
    definition:
      "A fact table with one row per instance of a process (an order, a claim), holding a date for each milestone and updated as it progresses.",
    module: "fact-tables",
  },
  "additive-fact": {
    term: "Additive fact",
    definition: "A fact that can be summed across every dimension, such as sales amount.",
    module: "fact-tables",
  },
  "semi-additive-fact": {
    term: "Semi-additive fact",
    definition:
      "A fact that can be summed across some dimensions but not others; balances add across accounts but not across time.",
    module: "fact-tables",
  },
  "factless-fact": {
    term: "Factless fact table",
    definition:
      "A fact table whose rows record only that dimensions met, such as a student attending a class, with no numeric measures.",
    module: "fact-tables",
  },
  "conformed-dimension": {
    term: "Conformed dimension",
    definition:
      "A dimension shared by several fact tables with identical column names and values, so their results can be combined on one report.",
    module: "conformed-dimensions",
  },
  "bus-matrix": {
    term: "Bus matrix",
    definition:
      "A grid with business processes as rows and dimensions as columns, marking which dimensions each process uses. Used to plan a warehouse one process at a time.",
    module: "conformed-dimensions",
  },
  "drill-across": {
    term: "Drill across",
    definition:
      "Combining fact tables by querying each one separately, grouped by the same conformed attributes, then merging the answers.",
    module: "conformed-dimensions",
  },
  "role-playing-dimension": {
    term: "Role-playing dimension",
    definition:
      "One dimension used several times by a fact table in different roles, such as order date and ship date, each through its own view.",
    module: "dimension-patterns",
  },
  "junk-dimension": {
    term: "Junk dimension",
    definition:
      "A single dimension that bundles miscellaneous low-cardinality flags and indicators, holding only the combinations that occur.",
    module: "dimension-patterns",
  },
  snowflake: {
    term: "Snowflake schema",
    definition:
      "A star schema whose dimension hierarchies are normalised into chains of smaller tables. Kimball advises flattening them instead.",
    module: "dimension-patterns",
  },
  outrigger: {
    term: "Outrigger",
    definition:
      "A dimension that references another dimension, such as a customer pointing to the date they joined. Allowed but used sparingly.",
    module: "dimension-patterns",
  },
  scd: {
    term: "Slowly changing dimension (SCD)",
    definition:
      "Kimball's numbered techniques (type 0 to type 7) for handling dimension attributes that change over time, such as a customer's city.",
    module: "scd",
  },
  "scd-type-1": {
    term: "SCD type 1",
    definition:
      "Handling a change by overwriting the old value. Always current, but history is lost.",
    module: "scd",
  },
  "scd-type-2": {
    term: "SCD type 2",
    definition:
      "Handling a change by adding a new dimension row with its own surrogate key and validity dates, so facts keep the version in effect when they happened.",
    module: "scd",
  },
  "mini-dimension": {
    term: "Mini-dimension (SCD type 4)",
    definition:
      "A small separate dimension for attributes that change often, such as age or credit band, so the main dimension doesn't grow a new row each time.",
    module: "scd",
  },
  "enterprise-data-warehouse": {
    term: "Enterprise data warehouse (EDW)",
    definition:
      "A warehouse that integrates data from across a whole organisation, with history, for reporting and analysis.",
    module: "inmon-kimball",
  },
  "data-mart": {
    term: "Data mart",
    definition:
      "A smaller set of analytical tables for one department or subject area, often dimensional.",
    module: "inmon-kimball",
  },
  "corporate-information-factory": {
    term: "Corporate Information Factory (CIF)",
    definition:
      "Bill Inmon's architecture: a normalised, atomic enterprise warehouse loaded first, which then feeds departmental data marts.",
    module: "inmon-kimball",
  },
  "data-vault": {
    term: "Data Vault",
    definition:
      "A warehouse modelling method by Dan Linstedt that splits data into hubs (business keys), links (relationships) and satellites (descriptive history), loaded append-only with full audit details.",
    module: "data-vault",
  },
  hub: {
    term: "Hub",
    definition:
      "A Data Vault table holding one row per unique business key, such as a customer number, with its load date and source.",
    module: "data-vault",
  },
  "link-table": {
    term: "Link",
    definition:
      "A Data Vault table recording a relationship or transaction between hubs, such as which customer placed which order.",
    module: "data-vault",
  },
  satellite: {
    term: "Satellite",
    definition:
      "A Data Vault table holding descriptive attributes of a hub or link, with a new row for every change.",
    module: "data-vault",
  },
  "one-big-table": {
    term: "One big table (OBT)",
    definition:
      "A single wide, denormalised table holding the facts plus every dimension attribute on each row, so queries need no joins.",
    module: "wide-tables",
  },
  "columnar-storage": {
    term: "Columnar storage",
    definition:
      "Storing each column's values together rather than each row's, so a query reads only the columns it uses and repeated values compress well.",
    module: "wide-tables",
  },
  "nested-fields": {
    term: "Nested and repeated fields",
    definition:
      "Columns that hold structures (STRUCT) or lists (ARRAY), letting a row carry its children, such as an order with its lines.",
    module: "wide-tables",
  },
  "semantic-layer": {
    term: "Semantic layer",
    definition:
      "A shared place where business metrics, dimensions and joins are defined once, so every tool that asks for, say, revenue by month gets SQL from the same definition.",
    module: "semantic-layer",
  },
  "metric-definition": {
    term: "Metric",
    definition:
      "A named, agreed calculation such as revenue or active customers, including its aggregation and filters.",
    module: "semantic-layer",
  },
  dbt: {
    term: "dbt",
    definition:
      "A tool for transforming data inside a warehouse: each model is a SQL select statement, and dbt builds them in dependency order with tests, documentation and version control.",
    module: "dbt-layers",
  },
  "staging-model": {
    term: "Staging model",
    definition:
      "A dbt model that cleans one source table: renaming columns and casting types, one-to-one with the source.",
    module: "dbt-layers",
  },
  "mart-model": {
    term: "Mart",
    definition:
      "A finished model representing a business entity at a clear grain, such as orders or customers, ready for people and tools to query.",
    module: "dbt-layers",
  },
  "lineage-graph": {
    term: "Lineage",
    definition:
      "The graph of which models and sources each table is built from, so you can trace any number back to where it came from.",
    module: "dbt-layers",
  },
  "data-test": {
    term: "Data test",
    definition:
      "An assertion checked against a model's data on every run, such as a column being unique, never null, or pointing at existing rows.",
    module: "dbt-layers",
  },
} satisfies Record<string, GlossaryEntry>;
