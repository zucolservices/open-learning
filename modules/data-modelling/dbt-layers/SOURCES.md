# Sources: Layered modelling with dbt (fact-checked 2026-10-04)

- dbt docs, "How we structure our dbt projects" (overview, staging, intermediate, marts: one-to-one staging, stg_[source]__[entity]s naming, intermediate "often" added, marts at their unique grain).
- dbt docs: introduction; ref() (schema interpolation and dependency graph); data tests (four generic tests; "tests" renamed "data tests").
- T. Handy, dbt Labs blog, 13 Oct 2025 (merger with Fivetran announced); TechTarget, 1 Jun 2026 (merger completed).
- dbt Developer Blog, 28 May 2025 (Fusion engine); dbt Labs blog, "The future of dbt Core v2.0" (alpha 1 Jun 2026, Rust, Apache 2.0).

The shop project and its models are made up; YAML follows recent dbt syntax and may differ by version.
