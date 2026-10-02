# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m20-facts.md` (raw pages in `k8s/m20/`).

- kubernetes.io, Debug Pods: "The first step in debugging a Pod is taking a look at it"; "If a Pod is stuck in Pending it means that it can not be scheduled onto a node." Debug Running Pods: kubectl get events (namespaced), kubectl logs --previous ("print the logs for the previous instance of the container in a pod if it exists"), ephemeral containers (stable since v1.25) for distroless images, kubectl debug node/… (root filesystem at /host). kubectl debug's default profile is general since kubectl 1.36; legacy is deprecated (planned removal v1.39). https://kubernetes.io/docs/tasks/debug/debug-application/
- Scheduler FailedScheduling message format ("0/X nodes are available: … preemption: …") from kube-scheduler source; reasons such as "Insufficient cpu", "node(s) had untolerated taint(s)".
- kubernetes.io, Images: invalid image name or tag, private registry without imagePullSecret; image pull back-off limit 300 seconds; ErrImagePull, ImagePullBackOff, InvalidImageName.
- Restart back-off 10 s doubling to 300 s, reset after 10 minutes (Pod lifecycle). OOMKilled example ("Reason: OOMKilled / Exit Code: 137") in Resource Management for Pods and Containers. bash: "128+N" exit status on fatal signal N (SIGKILL 9 → 137, SIGTERM 15 → 143).
- Debug Services: check EndpointSlices; kubectl shows <unset> for empty slices; the Endpoints API deprecated in v1.33. Events retained 1 h by default (--event-ttl). kubectl top needs metrics-server.
- Pod names, images, log lines and outputs in the incidents are illustrative but follow real formats.
