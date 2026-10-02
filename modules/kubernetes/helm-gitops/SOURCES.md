# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m19-facts.md` (raw pages in `k8s/m19/`).

- Helm: "The package manager for Kubernetes"; Helm 3 removed Tiller (Nov 2019); charts stored in OCI registries ("It is recommended to use container registries with OCI support"); CNCF graduated 30 Apr 2020; Helm 4.0.0 released 12 Nov 2025 ("the first new major version of Helm in 6 years"); Helm 3 security fixes until 10 Feb 2027. https://helm.sh/
- Kustomize: kubectl supports it "Since 1.14" (kubectl apply -k); bases and overlays; "a template-free way". https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/
- OpenGitOps principles v1.0.0: Declarative; Versioned and Immutable; Pulled Automatically ("Software agents automatically pull the desired state declarations from the source."); Continuously Reconciled. https://opengitops.dev/
- Argo CD automated sync: "An automated sync will only be performed if the application is OutOfSync."; "By default, changes that are made to the live cluster will not trigger automated sync" (selfHeal and prune off by default). Argo graduated (CNCF) 6 Dec 2022; Argo CD 3.0 in spring 2025. https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/
- Flux: CNCF graduated 30 Nov 2022; source, kustomize, helm, notification and image automation controllers; drift detected and corrected on every interval (ten minutes in the docs example). Weaveworks ceased operations Feb 2024; Flux continues with ControlPlane and other backers.
- Sealed Secrets ("can be decrypted only by the controller running in the target cluster"), SOPS.
- Values, tags and timings in the demos are illustrative; the Flux interval is shortened.
