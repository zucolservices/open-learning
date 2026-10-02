# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m18-facts.md` (raw pages in `k8s/m18/`).

- kubernetes.io, Pod Security Standards: Privileged, Baseline, Restricted; "Privileged Pods disable most security mechanisms and must be disallowed."; Baseline controls (privileged, host namespaces, hostPath, hostPorts, capabilities beyond the default set, probe/lifecycle host field since v1.34, …); Restricted adds volume types, allowPrivilegeEscalation: false, runAsNonRoot: true, runAsUser not 0, seccomp RuntimeDefault/Localhost, drop ALL (NET_BIND_SERVICE may be added); user-namespace relaxations. https://kubernetes.io/docs/concepts/security/pod-security-standards/
- kubernetes.io, Pod Security Admission: stable since v1.25; modes enforce / audit / warn via pod-security.kubernetes.io/<MODE>: <LEVEL> labels; enforcement applies to pods, not workload objects (warnings for workloads). PodSecurityPolicy removed in v1.25.
- User namespaces (hostUsers: false) stable since v1.36. ValidatingAdmissionPolicy GA in v1.30; MutatingAdmissionPolicy GA in v1.36.
- Kyverno: CNCF graduated (16 Mar 2026); ImageValidatingPolicy for image verification (v1.19). OPA graduated (29 Jan 2021); Gatekeeper. Sigstore (OpenSSF) cosign and policy-controller; image digests "immutable and prevents spoofing attacks".
- Application security checklist recommends readOnlyRootFilesystem.
- The pod settings and their combinations are illustrative; violation messages are paraphrased.
