# Extending Kubernetes (Kubernetes, module 21)

1. **A specialist on staff** (analogy): general ward routines vs a dialysis specialist = built-in controllers vs an operator.
2. **Teach the cluster a new word** ⭐ (step-through): unknown kind → CRD installed (stored, no action) → operator creates StatefulSet, Services, Secret, backups → primary dies, replica promoted → version bump upgrades → delete with a finalizer and owner references.
3. **Operators in the wild** (explore): cert-manager, CloudNativePG, Strimzi, Prometheus Operator, Crossplane; capability levels; frameworks; cautions.
4. **Built-in, operator or managed?** (sort checkpoint).
5. **Wrap**.
