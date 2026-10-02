# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m15-facts.md` (raw pages in `k8s/m15/`).

- kubernetes.io, Horizontal Pod Autoscaling: desiredReplicas = ceil[currentReplicas × (currentMetricValue / desiredMetricValue)]; 15 s sync period; 0.1 tolerance (per-HPA tolerance stable in 1.37); CPU utilization as a "percentage of the equivalent resource request"; scale-down stabilization window 300 s; resource, custom and external metrics APIs; Metrics Server must be installed separately; HPAScaleToZero beta (on by default) in 1.37, needing an object or external metric. https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/
- Vertical Pod Autoscaler (kubernetes/autoscaler): modes Off, Initial, Recreate (default), InPlaceOrRecreate (GA in VPA 1.6), InPlace; "should not be used with the HPA on the same resource metric (CPU or memory)".
- Cluster Autoscaler FAQ: scales up for pods that are unschedulable for lack of resources; scale-down utilization threshold 0.5 of requests; unneeded time 10 min; respects PodDisruptionBudgets; a new GCE node takes 3–4 minutes; spike to running pods "usually about 5 minutes".
- Karpenter (kubernetes-sigs, SIG Autoscaling; v1.0 announced 14 Aug 2024); EKS Auto Mode and AKS Node Auto Provisioning built on it. GKE node pool auto-creation. KEDA CNCF graduated (22 Aug 2023), scale to zero.
- The traffic shape, pod capacity, node size, start-up times and resulting curves are an illustrative simulation.
