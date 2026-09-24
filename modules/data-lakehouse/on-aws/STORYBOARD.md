# Storyboard: Lakehouse on AWS

Track: Modern Data Lakehouse · Chapter 8 · Module 24 · ~30 min · level: applied

Uses the shared platform components in `modules/data-lakehouse/_platform/` (LayerStory, PlatformBuilder, CostEstimator), reused by the GCP and Azure modules.

## Steps

| #   | Step                                | Interaction                                                                        | Gate   |
| --- | ----------------------------------- | ---------------------------------------------------------------------------------- | ------ |
| 1   | The layers you know, AWS edition ⭐ | **Scroll story**: generic layer → AWS service table fills in (city analogy)        |        |
| 2   | Assemble Brewline on AWS ⭐         | **Build-connect**: 8 jobs × 14 services, explained wrong picks, flow on completion |        |
| 3   | Many engines, one set of tables     | Glue Data Catalog + Lake Formation                                                 | choice |
| 4   | What will it cost? ⭐               | **Simulation**: monthly estimate from list prices; S3 Tables vs self-maintained    |        |
| 5   | The surprising bill                 | Athena bill → read less                                                            | choice |
| 6   | What to remember                    |                                                                                    |        |
