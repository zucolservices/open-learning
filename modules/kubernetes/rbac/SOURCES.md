# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m17-facts.md` (raw pages in `k8s/m17/`).

- kubernetes.io, Authenticating: "Kubernetes does not have objects which represent normal user accounts." Authorization overview: access "is denied by default".
- kubernetes.io, Using RBAC Authorization: Role, ClusterRole, RoleBinding, ClusterRoleBinding; "Permissions are purely additive (there are no "deny" rules)."; "a RoleBinding can reference a ClusterRole and bind that ClusterRole to the namespace of the RoleBinding"; resourceNames. https://kubernetes.io/docs/reference/access-authn-authz/rbac/
- kubernetes.io, Service Accounts: default service account per namespace, auto-assigned; token mounted at /var/run/secrets/kubernetes.io/serviceaccount; automountServiceAccountToken: false; bound tokens expire with the pod "or after a defined lifespan (by default, that is 1 hour)" and are refreshed by the kubelet; "In versions prior to v1.24, a permanent token was automatically created for each service account." Node-bound tokens stable in 1.33; external token signer stable in 1.36.
- kubernetes.io, RBAC Good Practices: least privilege, avoid wildcards, cluster-admin, "Avoid adding users to the system:masters group", listing/watching secrets, workload creation ("Pods can run as any ServiceAccount"), escalate, bind, impersonate, nodes/proxy ("get permission on nodes/proxy is not a read-only permission").
- kubectl auth can-i (--as system:serviceaccount:<ns>:<name>, --list).
- EKS Pod Identity (announced 26 Nov 2023) and IRSA; Workload Identity Federation for GKE ("the recommended way"); Microsoft Entra Workload ID (AKS pod-managed identity deprecated 2022, support ended Sept 2025).
- WIRED (20 Feb 2018), reporting RedLock: Tesla's Kubernetes console "wasn't password protected", with AWS credentials in a pod used for cryptomining.
- The image-resizer breach story, names and grants are fictional.
