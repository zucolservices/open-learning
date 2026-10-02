# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m05-facts.md` (raw pages in `k8s/m05/`).

- kubernetes.io, Deployments: a rollout is triggered "if and only if the Deployment's Pod template (that is, .spec.template) is changed"; scaling doesn't trigger one; ReplicaSet name `[DEPLOYMENT-NAME]-[HASH]` (pod-template-hash); revisionHistoryLimit default 10. https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- Strategies: RollingUpdate (default) and Recreate; maxSurge and maxUnavailable default 25%, maxSurge rounds up, maxUnavailable rounds down, both can't be 0; minReadySeconds default 0 (available "as soon as it is ready").
- progressDeadlineSeconds default 600; condition Progressing=False, reason ProgressDeadlineExceeded; "Kubernetes takes no action on a stalled Deployment other than to report a status condition".
- kubectl rollout status / history / undo [--to-revision] / pause / resume; CHANGE-CAUSE from the kubernetes.io/change-cause annotation; --record deprecated.
- Canary: multiple Deployments sharing a Service label (docs); blue/green by switching a Service selector is a common pattern; Argo Rollouts and Flagger provide progressive delivery.
- 2025–26: .status.terminatingReplicas (DeploymentReplicaSetTerminatingReplicas, beta since 1.35) only reports terminating pods; not shown.
- The simulation (10 s ticks, ~30 s pod start-up, hashes and pod suffixes) is illustrative; it follows the documented surge/unavailable rules.
