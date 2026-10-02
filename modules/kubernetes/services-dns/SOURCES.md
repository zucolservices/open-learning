# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m08-facts.md` (raw pages in `k8s/m08/`).

- kubernetes.io, Service: "a method for exposing a network application that is running as one or more Pods in your cluster"; Pods are ephemeral; selectors (equality-based only for Services); only Ready pods receive traffic ("the EndpointSlice controller removes the Pod's IP address from the EndpointSlices"); types ClusterIP (default), NodePort (30000-32767 by default), LoadBalancer (provided by the cloud or you), ExternalName (CNAME, "No proxying of any kind"), headless (clusterIP: None); targetPort defaults to port; Services without selectors; externalIPs deprecated since v1.36. https://kubernetes.io/docs/concepts/services-networking/service/
- EndpointSlices: 100 endpoints per slice by default (up to 1000); the Endpoints API "Deprecated since Kubernetes v1.33".
- Virtual IPs and kube-proxy: iptables mode is the default and picks a backend "at random" (nftables to become the default later; IPVS deprecated since v1.35); sessionAffinity ClientIP (timeout 10800 s); trafficDistribution PreferSameZone / PreferSameNode (stable in v1.35; PreferClose an older alias).
- DNS for Services and Pods: CoreDNS is "the default implementation of Kubernetes cluster DNS"; my-svc.my-namespace.svc.<cluster domain> (usually cluster.local); short names search the pod's own namespace; SRV records for named ports; headless Services return all ready pod IPs; StatefulSet pods get per-pod names.
- Traffic policies: internalTrafficPolicy Local; externalTrafficPolicy Local preserves the client source IP.
- Pod names, IPs, namespaces and the ClusterIP in the demos are illustrative.
