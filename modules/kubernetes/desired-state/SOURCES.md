# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m02-facts.md` (raw pages in `k8s/m02/`).

- kubernetes.io, Controllers: "In robotics and automation, a control loop is a non-terminating loop that regulates the state of a system."; thermostat: "When you set the temperature, that's telling the thermostat about your desired state. The actual room temperature is the current state."; controllers act through the API server (Job controller example); direct control of external systems. https://kubernetes.io/docs/concepts/architecture/controller/
- kubernetes.io glossary, Controller: "Controllers are control loops that watch the state of your cluster, then make or request changes where needed."; kube-controller-manager runs the controllers in a single process.
- kubernetes.io, Kubernetes objects: "Almost every Kubernetes object includes" a spec and a status; an object is a "record of intent".
- kubernetes.io, Object management: imperative commands, imperative object configuration, declarative (kubectl apply); "A Kubernetes object should be managed using only one technique. Mixing and matching techniques for the same object results in undefined behavior."; declarative config walkthrough: a field omitted from the file "retains the value of 2 set by kubectl scale". Server-side apply GA in 1.22.
- Kubernetes community API conventions: "the system's behavior is level-based rather than edge-based" (2 → 5 → 3, not required to "touch base" at 5).
- Node failure: node-monitor-grace-period 50 s (since v1.32); node.kubernetes.io/not-ready and unreachable taints with a 300 s default toleration (DefaultTolerationSeconds); taint-based eviction by the taint-eviction-controller (since 1.29). ReplicaSets replace deleted pods with new names; bare pods are not recreated; the default container restartPolicy is Always.
- The simulation compresses time (one tick = 10 s); pod names, node counts and placement are illustrative.
