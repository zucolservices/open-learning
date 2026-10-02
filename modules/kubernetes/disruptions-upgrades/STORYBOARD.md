# Disruptions and upgrades (Kubernetes, module 16)

1. **Road works on a busy highway** (analogy): planned lane closures with a two-lanes-open rule vs a landslide.
2. **Drain the nodes** ⭐ (simulation): the docs' three-node example; drain one / two / all nodes, with or without a minAvailable 2 budget; cordoned nodes, evictions, replacements, Pending, 429s; outcome (outage, degraded, stuck, safe).
3. **Upgrading Kubernetes** (step-through): 1.35 → 1.36 → 1.37 control plane, kubelets up to three minors behind, surge node upgrades, removed APIs.
4. **Does the budget apply?** (sort checkpoint).
5. **Wrap**.
