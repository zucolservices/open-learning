# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m13-facts.md` (raw pages in `cicd/m13/`).

- Martin Fowler, bliki "BlueGreenDeployment" (2010): "if anything goes wrong you switch the router back to your blue environment"; the name from "some foggy combination of Daniel Terhorst-North and Jez Humble". Colours are only labels (the SRE Workbook uses green = live).
- Danilo Sato, bliki "CanaryRelease" (martinfowler.com, 2014); Google SRE Workbook, "Canarying Releases": "a partial and time-limited deployment of a change in a service and its evaluation"; canary vs control; 20% errors × 5% canary = 1% overall; blue-green needs "twice as many resources".
- Kubernetes Deployments: RollingUpdate default, maxSurge 25%, maxUnavailable 25%; Recreate strategy.
- Istio/Envoy traffic mirroring ("fire and forget"; responses discarded). Facebook Chat dark launch (2008) was client-side.
- Tools: Argo Rollouts (Argo graduated CNCF Dec 2022), Flagger (Flux subproject), AWS CodeDeploy, Amazon ECS built-in blue/green (17 Jul 2025) and canary/linear (30 Oct 2025), Google Cloud Deploy canary, Azure Container Apps revisions, Spinnaker with Kayenta (Google and Netflix, Apr 2018).
- James Governor (RedMonk), "Progressive Delivery" (6 Aug 2018).
- CrowdStrike (19 Jul 2024): content update 04:09 UTC, reverted 05:27 UTC; about 8.5 million Windows devices (Microsoft estimate); root cause analysis commits to canary testing and staged deployment rings with bake-in time.
- Google Cloud incident report (12 Jun 2025): code rolled out region by region but the failing path was "not feature flag protected"; policy data replicated globally within seconds; about three hours.
- The bug rate, traffic and all timelines in the simulation are illustrative.
