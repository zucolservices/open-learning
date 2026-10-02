# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m03-facts.md` (raw pages in `k8s/m03/`).

- kubernetes.io, Cluster Architecture and Components: control plane (kube-apiserver, etcd, kube-scheduler, kube-controller-manager, cloud-controller-manager) and node components (kubelet, container runtime, kube-proxy); etcd: "Consistent and highly-available key value store used as Kubernetes' backing store for all cluster data". https://kubernetes.io/docs/concepts/architecture/
- kubernetes.io, Communication between Nodes and the Control Plane: "hub-and-spoke" API pattern. https://kubernetes.io/docs/concepts/architecture/control-plane-node-communication/
- kubernetes.io, Controlling access to the Kubernetes API: authentication, then authorization, then admission control (mutating, then validating), then object validation and storage. ValidatingAdmissionPolicy stable since v1.30; MutatingAdmissionPolicy stable since v1.36.
- kubernetes.io, Operating etcd clusters: "You should run etcd as a cluster with an odd number of members"; "A five-member cluster is recommended in production"; "ideally only the API server should have access to it". etcd FAQ: Raft, quorum (n/2)+1.
- kube-scheduler: filtering, scoring, and "binding". kubelet uses the CRI (gRPC) to drive containerd or CRI-O; the runtime invokes the CNI plugin.
- kube-proxy: iptables remains the default on Linux; nftables stable since v1.33; IPVS deprecated in v1.35.
- cloud-controller-manager: node, route and service controllers (labelled beta since v1.11). CoreDNS is the default cluster DNS; metrics-server feeds the Metrics API used by autoscalers.
- Managed services (EKS, GKE, AKS) run the control plane; GKE Autopilot, EKS Auto Mode and AKS Automatic also manage nodes.
- The restaurant analogy and the three-node diagram are illustrative.
