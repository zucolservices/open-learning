# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m21-facts.md` (raw pages in `k8s/m21/`).

- kubernetes.io, Custom Resources: "A custom resource is an extension of the Kubernetes API that is not necessarily available in a default Kubernetes installation."; CRDs "can be created without any programming", API aggregation "requires programming"; CEL validation rules stable since v1.29. https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
- kubernetes.io, Operator pattern: "Operators are software extensions to Kubernetes that make use of custom resources to manage applications and their components. Operators follow Kubernetes principles, notably the control loop."; examples (deploying on demand, backups and restores, upgrades with schema changes, …); frameworks incl. Kubebuilder, Operator SDK, Java Operator SDK, Kopf, kube-rs, KubeOps. https://kubernetes.io/docs/concepts/extend-kubernetes/operator/
- CoreOS, "Introducing Operators: Putting Operational Knowledge into Software", Brandon Philips, 3 Nov 2016.
- Operator Framework (CNCF incubating since 2020); capability levels Basic Install, Seamless Upgrades, Full Lifecycle, Deep Insights, Auto Pilot (Operator SDK docs).
- CloudNativePG (CNCF sandbox, Jan 2025), Strimzi (CNCF incubating, 2024), cert-manager (CNCF graduated, 2024), Crossplane (CNCF graduated, Oct 2025), Prometheus Operator.
- kubernetes.io, Finalizers; Owners and Dependents; Garbage Collection.
- The PostgresCluster resource, its operator and its failover/upgrade behaviour are illustrative; failover is what this example operator does, not a docs-listed duty.
