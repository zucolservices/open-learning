# Desired state and the control loop (Kubernetes, module 2)

1. **The thermostat** (analogy): set desired temperature; current temperature converges; kubernetes.io quote.
2. **Break it, watch it heal** ⭐ (simulation): three nodes; delete pods, change replicas, cut a node's power (50 s grace + 300 s toleration, then eviction and replacement); switch to bare pods that aren't recreated; controller log.
3. **Spec and status** (step-through): apply, status 0/3, controllers reach 3/3, level-based 3→5→3, drift via kubectl scale.
4. **Will it come back?** (sort checkpoint).
5. **Wrap**.
