# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m09-facts.md` (raw pages in `k8s/m09/`).

- kubernetes.io, Ingress: "The Kubernetes project recommends using Gateway instead of Ingress. The Ingress API has been frozen."; "Only creating an Ingress resource has no effect."; IngressClass; host and path rules; pathType Exact / Prefix / ImplementationSpecific; TLS from a Secret; controller-specific annotations. https://kubernetes.io/docs/concepts/services-networking/ingress/
- Kubernetes blog, Ingress NGINX retirement (11 Nov 2025): "Best-effort maintenance will continue until March 2026. Afterward, there will be no further releases, no bugfixes, and no updates to resolve any security vulnerabilities"; Steering Committee / SRC statement (29 Jan 2026): about half of cloud native environments relied on it; repository archived 24 Mar 2026. NGINX Inc's NGINX Ingress Controller (github.com/nginx/kubernetes-ingress) is a separate, active project.
- Gateway API (gateway-api.sigs.k8s.io and release blogs): GA 31 Oct 2023; GRPCRoute GA in v1.1; v1.5 (27 Feb 2026) TLSRoute, ListenerSet, CORS, ReferenceGrant; v1.6 (30 Jun 2026) TCPRoute and UDPRoute GA; roles: infrastructure provider (GatewayClass), cluster operator (Gateway), application developer (routes); header matching, weighted backendRefs, request mirroring (Extended), ReferenceGrant.
- Implementations: conformant Envoy Gateway, Istio, Cilium, NGINX Gateway Fabric, Traefik, GKE, kgateway, Kong Operator; AWS Load Balancer Controller and Amazon EKS (VPC Lattice) partially conformant; Azure Application Gateway for Containers supports Gateway API.
- ingress2gateway 1.0 (20 Mar 2026). cert-manager: CNCF graduated (2024), issues and renews Let's Encrypt certificates.
- Hostnames, Services, weights and YAML (abbreviated) are illustrative.
