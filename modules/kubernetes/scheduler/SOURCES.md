# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m14-facts.md` (raw pages in `k8s/m14/`).

- kubernetes.io, Kubernetes Scheduler: "filtering and scoring"; "feasible" nodes; a pod with none "remains unscheduled"; ties broken "at random"; binding. https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/
- Scheduling framework: PreFilter, Filter, PostFilter, Score, Reserve, Permit, PreBind, Bind; default plugins NodeResourcesFit (LeastAllocated default; MostAllocated, RequestedToCapacityRatio), NodeAffinity, TaintToleration, PodTopologySpread, VolumeBinding, VolumeZone, InterPodAffinity, ImageLocality.
- kubernetes.io, Assigning Pods to Nodes: nodeSelector "the simplest recommended form"; required/preferred node affinity (weights 1–100); "IgnoredDuringExecution means that if the node labels change after Kubernetes schedules the Pod, the Pod continues to run."; inter-pod affinity warning ("We do not recommend using them in clusters larger than several hundred nodes.").
- kubernetes.io, Taints and Tolerations: "Taints are the opposite -- they allow a node to repel a set of pods."; "Tolerations allow scheduling but don't guarantee scheduling"; effects NoSchedule, PreferNoSchedule, NoExecute; kubeadm taints control-plane nodes.
- kubernetes.io, Pod Topology Spread Constraints: maxSkew, topologyKey, whenUnsatisfiable (DoNotSchedule default, ScheduleAnyway); built-in defaults maxSkew 3 per hostname and 5 per zone, ScheduleAnyway.
- kubernetes.io, Pod Priority and Preemption: PriorityClass; system-cluster-critical and system-node-critical. DRA GA in 1.34; gang scheduling alpha in 1.35, beta (off by default) in 1.37.
- Node layout, scores (a simplified LeastAllocated plus a preferred-affinity bonus) and the replica distribution are illustrative.
