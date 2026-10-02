# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m04-facts.md` (raw pages in `k8s/m04/`).

- kubernetes.io, Pods: "Pods are the smallest deployable units of computing that you can create and manage in Kubernetes."; "A Pod (as in a pod of whales or pea pod) is a group of one or more containers, with shared storage and network resources, and a specification for how to run the containers."; one container per pod is "the most common Kubernetes use case", multi-container pods "a relatively advanced use case"; "You'll rarely create individual Pods directly in Kubernetes—even singleton Pods." https://kubernetes.io/docs/concepts/workloads/pods/
- kubernetes.io, Cluster networking: "Each pod in a cluster gets its own unique cluster-wide IP address."; containers in a pod share the network namespace (localhost) and can share volumes.
- kubernetes.io, Init containers: run to completion, one after another; failed init containers are retried. Sidecar containers: init containers with restartPolicy: Always, stable since v1.33; stopped after the main containers, in reverse order.
- kubernetes.io, Pod lifecycle: phases Pending, Running, Succeeded, Failed, Unknown; CrashLoopBackOff is not a phase; container states Waiting, Running, Terminated; restartPolicy Always (default), OnFailure, Never; back-off "10s, 20s, 40s, …" capped at 300 s, reset after 10 minutes; termination grace period 30 s default, SIGTERM (or the image's STOPSIGNAL) then KILL, preStop hooks; a Pod "is never "rescheduled" to a different node; instead, that Pod can be replaced by a new, near-identical Pod."
- Static pods (kubelet-managed), ephemeral containers (stable since v1.25), in-place pod resize (stable since v1.35) — background, not shown.
- Pod names, IPs, ports and the log-shipper example are illustrative.
