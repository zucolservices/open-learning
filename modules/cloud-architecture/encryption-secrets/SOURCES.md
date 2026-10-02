# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m11-facts.md`.

- Default encryption: S3 SSE-S3 (AES-256) on all new objects since 5 Jan 2023; EBS encryption by default still opt-in per Region; Azure Storage encryption always on (AES-256-GCM); Google Cloud default encryption AES-256 with per-chunk data keys.
- Envelope encryption: AWS KMS GenerateDataKey; direct Encrypt limited to 4,096 bytes; AWS KMS HSMs FIPS 140-3 Level 3; Azure Key Vault Premium / Managed HSM FIPS 140-3 Level 3; Google Cloud HSM FIPS 140-2 Level 3.
- Rotation: AWS automatic rotation 365 days default, 90–2,560 configurable, on-demand up to 25; old material retained; does not re-encrypt data. Azure: rotation re-wraps DEKs, doesn't re-encrypt data.
- Disable/delete: disabling takes effect when the key is next used (attached EBS volumes keep working until next attach). AWS deletion waiting period 7–30 days (default 30). Google key version destruction 30 days default (24 h–120 days). Azure Key Vault soft-delete on by default (7–90 days, default 90); purge protection off by default, required by most CMK integrations.
- Ownership: AWS KMS $1/key/month, $0.03 per 10,000 requests; Google Cloud KMS $0.06 per software key version/month, HSM $1, EKM $3; Azure Key Vault $0.03 per 10,000 operations, HSM keys $1/key/month. S3 Bucket Keys up to 99% lower KMS request costs. AWS XKS, Google Cloud EKM, Azure Managed HSM external keys (preview). S3 disables SSE-C by default on new buckets from 6 Apr 2026 (ransomware abuse).
- In transit: AWS TLS 1.2 minimum on all API endpoints (27 Feb 2024); Azure TLS 1.0/1.1 retirement mostly 31 Aug 2025, Azure Storage enforced 3 Feb 2026.
- Secret managers: AWS Secrets Manager $0.40/secret/month + $0.05 per 10,000 calls, managed rotation; Parameter Store standard free; Google Secret Manager 6 active versions free then $0.06/version/month; HashiCorp BSL (10 Aug 2023), OpenBao (Linux Foundation, MPL-2.0), IBM acquisition closed 27 Feb 2025. Kubernetes Secrets unencrypted in etcd by default.
- India: DPDP Rules 2025 (Gazette 13 Nov 2025), Rule 6 "encryption, obfuscation, masking or the use of virtual tokens", in force 13 May 2027; penalty up to ₹250 crore for failing reasonable security safeguards.
- The encryption in step 2 is real AES-256-GCM via the browser's WebCrypto API; the "KMS" is simulated in the page.
