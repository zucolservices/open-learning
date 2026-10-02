# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m16-facts.md` (raw pages in `k8s/m16/`).

- kubernetes.io, Disruptions: voluntary and involuntary examples; "Involuntary disruptions cannot be prevented by PDBs; however they do count against the budget."; "deleting deployments or pods bypasses Pod Disruption Budgets"; rolling updates "not limited by PDBs"; the three-node pod-a/b/c + pod-x example with minAvailable 2; unhealthyPodEvictionPolicy (GA 1.31, AlwaysAllow recommended). https://kubernetes.io/docs/concepts/workloads/pods/disruptions/
- kubernetes.io, Specifying a Disruption Budget: minAvailable or maxUnavailable (number or percentage, rounded up); evictions refused with 429; a zero budget means "you cannot successfully drain a Node".
- kubernetes.io, Safely Drain a Node: kubectl drain cordons then evicts via the Eviction API, retrying "until all Pods on the target node are terminated, or until a configurable timeout is reached"; --ignore-daemonsets, --delete-emptydir-data; --disable-eviction bypasses PDBs.
- Graceful node shutdown beta since v1.21 (Linux); non-graceful node shutdown (out-of-service taint) GA in 1.28.
- kubernetes.io, Releases and Version Skew Policy: about three minor releases a year, ~14 months of patches, three newest maintained; kubelet "must not be newer than kube-apiserver" and "may be up to three minor versions older"; kube-apiserver must not skip minor versions. kubeadm: "Skipping MINOR versions when upgrading is unsupported"; control plane first, then nodes.
- EKS: 14 months standard + 12 months extended support ($0.60 vs $0.10 per cluster-hour). GKE release channels (Rapid, Regular, Stable, Extended), maintenance windows. AKS LTS (~24 months, Premium tier), auto-upgrade channels. Surge and blue/green node pool upgrades.
- Deprecated API migration guide (e.g. flowcontrol.apiserver.k8s.io/v1beta3 no longer served from 1.32); Pluto (FairwindsOps) finds deprecated APIs.
- Timings and pod names in the drain simulation are illustrative.
