# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m13-facts.md` (raw pages in `k8s/m13/`).

- kubernetes.io, Resource Management for Pods and Containers: requests are used by "the kube-scheduler … to decide which node to place the Pod on", even when "actual memory or CPU resource usage on nodes is very low"; "cpu limits are enforced by CPU throttling"; "memory limits are enforced by the kernel with out of memory (OOM) kills"; units ("100m … one hundred millicpu"; "If you request 400m of memory, this is a request for 0.4 bytes"); a limit without a request copies the limit as the request unless an admission default applies; pod-level resources beta in 1.37. https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
- kubernetes.io, Reserve compute resources for system daemons: allocatable example 32Gi / 16 CPU → "14.5 CPUs, 28.5Gi of memory".
- kubernetes.io, Pod Quality of Service classes: Guaranteed, Burstable, BestEffort definitions.
- kubernetes.io, Node-pressure eviction: "The kubelet does not use the pod's QoS class to determine the eviction order"; ranking by usage exceeding requests, then priority, then usage relative to requests.
- kubernetes.io, LimitRange ("a policy to constrain the resource allocations… in a namespace") and ResourceQuota ("constraints that limit aggregate resource consumption per namespace").
- CPU limits: the official docs present them as a choice; "avoid CPU limits" is community advice (discussed on the Kubernetes blog, 2023).
- Pod sizes, usage ratios and the limits demo are illustrative.
