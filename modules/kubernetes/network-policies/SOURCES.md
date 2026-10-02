# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m10-facts.md` (raw pages in `k8s/m10/`).

- kubernetes.io, Network Policies: "By default, a pod is non-isolated for ingress; all inbound connections are allowed." (same for egress); isolation once a policy with that policyType selects the pod; "Network policies do not conflict; they are additive."; "Creating a NetworkPolicy resource without a controller that implements it will have no effect."; "both the egress policy on the source pod and the ingress policy on the destination pod need to allow the connection"; selector AND/OR example; default deny examples; "A default deny-all egress policy also blocks DNS traffic… you must add a separate NetworkPolicy that allows egress to your cluster's DNS service."; endPort stable since v1.25; what you can't do (TLS, logging, explicit deny, services by name, cluster-wide defaults…); traffic from the pod's own node is always allowed. https://kubernetes.io/docs/concepts/services-networking/network-policies/
- Enforcement: Calico, Cilium; GKE Dataplane V2 ("Kubernetes NetworkPolicy is always on"); Amazon VPC CNI network policy support (Aug 2023); AKS with Cilium, Azure NPM or Calico.
- network-policy-api v0.2.0 (21 Apr 2026): AdminNetworkPolicy and BaselineAdminNetworkPolicy merged into an alpha ClusterNetworkPolicy CRD with tiers.
- The shop app, debug pod, ports and the eight policies are illustrative; the DNS allow policy is our own example.
