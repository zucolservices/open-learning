# Deployments and rolling updates (Kubernetes, module 5)

1. **Shift change at a busy restaurant** (analogy): everyone at once (Recreate) vs a few at a time (rolling update).
2. **Roll it out** ⭐ (simulation): 10 replicas v1 → v2; maxSurge/maxUnavailable 0–5; Recreate; broken v2 stalls → ProgressDeadlineExceeded after 600 s; kubectl rollout undo; ready-pods chart with the minimum line.
3. **Under the hood** (explore): Deployment → ReplicaSets (revision, hash) → pods; rollout commands; blue/green and canary tools.
4. **Does it roll?** (sort checkpoint).
5. **Wrap**.
