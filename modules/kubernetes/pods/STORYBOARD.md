# Pods (Kubernetes, module 4)

1. **A shared flat** (analogy): one address (IP), shared rooms (volumes), own bedrooms (filesystems), moving out together.
2. **Build a pod** ⭐ (build): add an init container, a log-shipping sidecar, a shared volume; port clash on 8080; start-up order.
3. **A pod's life** ⭐ (step-through): Pending, init, Running, crash and restart, CrashLoopBackOff back-off 10→300 s, termination (SIGTERM, 30 s, SIGKILL), replaced not rescheduled.
4. **Same pod or separate?** (sort checkpoint).
5. **Wrap**.
