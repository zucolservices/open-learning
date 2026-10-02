# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m06-facts.md` (raw pages in `k8s/m06/`).

- kubernetes.io, Liveness, Readiness, and Startup Probes (concept page): the three probe types; on liveness failure the container "is subjected to its restart policy"; mechanisms httpGet (200–399), tcpSocket, exec (exit 0), grpc (SERVING; stable since v1.27); defaults initialDelaySeconds 0, periodSeconds 10, timeoutSeconds 1, successThreshold 1 ("Must be 1 for liveness and startup Probes"), failureThreshold 3; "Liveness probes can be a powerful way to recover from application failures, but they should be used with caution."; "Incorrect implementation of liveness probes can lead to cascading failures."; "The liveness probe passes when the app itself is healthy, but the readiness probe additionally checks that each required back-end service is available."; "Readiness probes run on the container during its whole lifecycle." https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/
- kubernetes.io, Pod lifecycle: "If a container does not provide a particular probe, the kubelet always considers the result as Success."
- kubernetes.io, Configure liveness, readiness and startup probes: startup probe example failureThreshold 30 × periodSeconds 10 = 300 s.
- Termination: terminating endpoints stay in EndpointSlices marked not ready; SIGTERM after preStop; preStop sleep action stable since v1.34. Using a short preStop sleep to let traffic drain is common practice, not a documented guarantee.
- The 60-second start, the 40-second database outage, per-second timeline and restart back-off timings are an illustrative simulation using the default probe settings.
