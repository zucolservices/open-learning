# Debugging a cluster (Kubernetes, module 20)

1. **A doctor's questions** (analogy): look, history, last words, wiring = get pods, describe, logs --previous, endpointslices.
2. **Five incidents** ⭐ (branching scenario): Pending (requests too big), ImagePullBackOff (missing tag), CrashLoopBackOff (missing config), OOMKilled (memory limit), Service with no endpoints (selector typo); run commands, read output, choose a diagnosis with feedback.
3. **The toolbox** (explore): describe, logs --previous, events, kubectl debug (profiles), node debug, top, exit codes.
4. **First command?** (sort checkpoint).
5. **Wrap**.
