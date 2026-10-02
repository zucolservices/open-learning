# Persistent storage (Kubernetes, module 12)

1. **Where do you keep your things?** (analogy): desk drawer, whiteboard, wall, one-city storage unit, two-city unit.
2. **Move the database** ⭐ (simulation): container filesystem / emptyDir / hostPath / zonal PVC / regional PVC × crash / drain with room / drain with zone full / zone down; four nodes in two zones; data kept, lost or out of reach (Pending).
3. **Claim, provision, attach** (step-through): PVC → StorageClass (WaitForFirstConsumer) → CSI provisions in the pod's zone → attach → reclaim policy.
4. **Which storage?** (sort checkpoint): emptyDir, block disk RWO, shared files RWX.
5. **Wrap**.
