# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m16-facts.md` (raw pages in `cicd/m16/`).

- Adrian Hilton, "Reliable releases and rollbacks — CRE life lessons" (Google Cloud blog, 25 Mar 2017): "the releasing team rolls back first and investigates the problem second"; "A request for a rollback is not interpreted as an attack on the releasing team"; "If you haven't rolled back in a few weeks, you should do a rollback 'just because'".
- AWS Builders' Library / Builder Center, "Ensuring rollback safety during deployments" (Sandeep Pokkunuri): protocol changes such as compression make rollback impossible once new data is written; two-phase Prepare and Activate deployments.
- US SEC, Release No. 34-70694: Knight "uninstalled the new RLP code from the seven servers where it had been deployed correctly. This action worsened the problem".
- CrowdStrike (19 Jul 2024): update at 04:09 UTC, reverted 05:27 UTC; crashed hosts needed manual remediation.
- Cloudflare post-mortem (2 Jul 2019): a WAF rule exhausted CPU; a global kill of the WAF managed rules; 27-minute outage.
- Automated rollback: Argo Rollouts (analysis aborts a rollout), Flagger, AWS CodeDeploy (CloudWatch alarms), Amazon ECS deployment circuit breaker and alarms, Google Cloud Deploy repairRollout. Kubernetes `kubectl rollout undo` (revisionHistoryLimit default 10).
- DORA metrics guide: failed deployment recovery time, "The time it takes to recover from a deployment that fails and requires immediate intervention"; deployment rework rate.
- The 6 p.m. scenarios, versions and minutes are illustrative.
