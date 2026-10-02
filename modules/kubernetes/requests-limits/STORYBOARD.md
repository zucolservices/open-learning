# Requests, limits and QoS (Kubernetes, module 13)

1. **A booked table and a plate size** (analogy): request = booking, limit = plate size; units and the 400m memory pitfall.
2. **Pack the nodes** ⭐ (simulation): two nodes with 14.5 CPU / 28.5 Gi allocatable; add web/worker/ml-train/sidecar pods; first-fit by requests; Pending with "Insufficient cpu" while usage is low.
3. **Hit the limit** ⭐ (simulation): requests 250m/256Mi, limits 500m/512Mi; CPU demand → throttled; memory demand → OOMKilled; toggle limits off.
4. **When a node runs short** (step-through): QoS classes; memory pressure; kubelet ranking (usage over requests, priority, relative usage); why QoS predicts it.
5. **Which QoS class?** (sort checkpoint).
6. **Wrap**.
