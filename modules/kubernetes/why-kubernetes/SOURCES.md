# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m01-facts.md` (raw pages in `k8s/m01/`).

- kubernetes.io, Overview: "Kubernetes is a portable, extensible, open source platform for managing containerized workloads and services that facilitate both declarative configuration and automation."; name from Greek "helmsman or pilot", K8s numeronym; open-sourced by Google in 2014; "What Kubernetes is not" ("not a traditional, all-inclusive PaaS"; "continuously drive the current state towards the provided desired state"); features incl. self-healing, automated rollouts and rollbacks, bin packing. https://kubernetes.io/docs/concepts/overview/
- kubernetes.io, Kubernetes objects: an object is a "record of intent"; desired state. https://kubernetes.io/docs/concepts/overview/working-with-objects/
- History: first commit 6 Jun 2014; announced 10 Jun 2014 (DockerCon); v1.0 21 Jul 2015 with the CNCF donation announced; accepted by CNCF 10 Mar 2016; first CNCF project to graduate, 6 Mar 2018. Current release v1.37 (26 Aug 2026); about three minor releases a year, ~14 months of patch support. https://kubernetes.io/releases/
- Verma et al., "Large-scale cluster management at Google with Borg", EuroSys 2015; Burns, Grant, Oppenheimer, Brewer, Wilkes, "Borg, Omega, and Kubernetes", ACM Queue 14(1), 2016 ("more than ten years", three container-management systems). https://research.google/pubs/borg-omega-and-kubernetes/
- Docker introduced March 2013 (PyCon lightning talk, Solomon Hykes); containers use Linux namespaces and cgroups; dockershim removed in v1.24 (May 2022), Docker-built images still run on any CRI runtime.
- CNCF Annual Cloud Native Survey 2025 (published 20 Jan 2026): "82% of container users now run Kubernetes in production, up from 66% in 2023."
- CNCF case study, Razorpay (18 Jun 2026): "7,000+ Kubernetes Nodes Secured". https://www.cncf.io/case-studies/razorpay/
- Simpler options: Google Cloud Run, Azure Container Apps, Amazon ECS with Fargate / ECS Express Mode. AWS App Runner closed to new customers from 30 Apr 2026, so it isn't suggested.
- The twenty-server story, server numbers and the "Who does the work?" step lists are illustrative.
