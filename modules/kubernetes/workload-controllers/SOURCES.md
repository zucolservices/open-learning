# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m07-facts.md` (raw pages in `k8s/m07/`).

- kubernetes.io, StatefulSets: "valuable for applications that require one or more of the following" (stable network identifiers, stable storage, ordered deployment and scaling, ordered rolling updates); pods named web-0…web-(N-1); volumeClaimTemplates; headless Service required ("You are responsible for creating this Service"); per-pod DNS; OrderedReady default, Parallel option; rolling updates "from the largest ordinal to the smallest"; volumes kept "to ensure data safety"; persistentVolumeClaimRetentionPolicy GA in 1.32 (Retain default); maxUnavailable beta, on by default in 1.37. https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/
- kubernetes.io, DaemonSet: "ensures that all (or some) Nodes run a copy of a Pod"; cluster storage, log collection and node monitoring daemons; nodeSelector/affinity; control-plane toleration added by you.
- kubernetes.io, Jobs: backoffLimit default 6; restartPolicy Never or OnFailure; activeDeadlineSeconds; ttlSecondsAfterFinished (GA 1.23); Indexed mode (GA 1.24); pod failure policy (GA 1.31); backoffLimitPerIndex and successPolicy (GA 1.33); managedBy (GA 1.35).
- kubernetes.io, CronJob: "meant for performing regular scheduled actions such as backups, report generation"; five-field schedule; timeZone (GA 1.27); concurrencyPolicy Allow/Forbid/Replace; history limits 3 and 1; "two Jobs might be created, or no Job might be created… the Jobs that you define should be idempotent."
- kubernetes.io, Deployments: for a stateless application, "usually one that doesn't maintain state".
- Using operators or managed databases for production databases is common practice, not a docs requirement. Pod names, node counts and timings in the demos are illustrative.
