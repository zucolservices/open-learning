# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `k8s/m23-facts.md`; the mechanisms reuse the fact-checks of modules 2, 5, 6, 11, 13–18 (`k8s/mNN-facts.md`).

- Rollouts: Recreate removes all old pods first; RollingUpdate with maxUnavailable 0 waits for readiness; a pod without a readiness probe counts as ready once running; ProgressDeadlineExceeded after 600 s, no automatic rollback (module 5–6).
- Node failure: ~50 s node-monitor grace period + 300 s toleration before eviction (module 2). Topology spread constraints; default scheduling spreads only as a preference (module 14).
- HPA needs requests to compute CPU utilisation; Cluster Autoscaler nodes take ~3–4 minutes (module 15). PDB maxUnavailable 0 allows zero voluntary evictions (module 16).
- Liveness should check the app; readiness also checks back-ends (module 6). Default service account and automountServiceAccountToken; avoid cluster-admin (module 17). Restricted Pod Security Standard (module 18). Secrets and encryption at rest (module 11).
- Reddit, "You Broke Reddit: The Pi-Day Outage" (r/RedditEng, Mar 2023): 314-minute outage on 14 Mar 2023 during a Kubernetes 1.23 → 1.24 upgrade; Calico route reflectors selected the removed node-role.kubernetes.io/master label.
- Monzo postmortem (Head of Engineering, Monzo community, 30 Oct 2017): 27 Oct 2017 payments outage triggered by a Kubernetes/etcd client bug and linkerd failing on services with no endpoints.
- The payments company, its choices and the incident outcomes are an illustrative scenario.
