# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `k8s/m11-facts.md` (raw pages in `k8s/m11/`).

- kubernetes.io, ConfigMaps: "an API object used to store non-confidential data in key-value pairs"; env vars, command arguments, volume files; 1 MiB limit; mounted ConfigMaps updated on the kubelet's periodic sync, env vars need a restart, subPath mounts never update; immutable ConfigMaps and Secrets stable since 1.21. https://kubernetes.io/docs/concepts/configuration/configmap/
- kubernetes.io, Secrets: caution box ("Kubernetes Secrets are, by default, stored unencrypted in the API server's underlying data store (etcd)… anyone who is authorized to create a Pod in a namespace can use that access to read any Secret in that namespace; this includes indirect access such as the ability to create a Deployment.") and its four steps (encryption at rest, least-privilege RBAC, restrict access to specific containers, external secret store providers); "Base64 encoding is not an encryption method, it provides no additional confidentiality over plain text."; 1 MiB limit; types incl. Opaque and kubernetes.io/tls; no auto-created long-lived service account token Secrets since v1.24. https://kubernetes.io/docs/concepts/configuration/secret/
- kubernetes.io, Encrypting confidential data at rest: providers identity (default, no encryption), aescbc (weak), aesgcm, secretbox, kms; KMS v2 stable since 1.29.
- kubernetes.io, Security checklist: secrets "automatically mounted through volumes, preferably stored in memory"; env vars "more prone to leakage due to crash dumps in logs".
- AWS (Mar 2025): Amazon EKS envelope-encrypts all Kubernetes API data by default (KMS v2, Kubernetes 1.28+). GKE encrypts data at rest by default; application-layer secrets encryption with Cloud KMS is optional. AKS KMS etcd encryption (legacy) and the newer KMS data encryption.
- Secrets Store CSI Driver (kubernetes-sigs); External Secrets Operator and SOPS (CNCF projects); Sealed Secrets (github.com/bitnami/sealed-secrets).
- The password, settings and the five threat scenarios are illustrative.
