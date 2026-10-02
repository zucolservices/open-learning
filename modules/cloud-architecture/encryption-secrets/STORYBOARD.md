# Encryption, keys and secrets (Cloud Architecture, module 11)

1. **Boxes, keys and the bank** (analogy): a key per box, sealed in an envelope only the bank's master key opens; master key never leaves the vault. Default encryption facts.
2. **Encrypt a file like the cloud does** ⭐ (step-through, real WebCrypto AES-256-GCM): type text → data key (plain + sealed) → ciphertext → discard plain key → unseal and decrypt.
3. **Rotate, disable, delete** ⭐ (simulation): rotate (old files still open), disable (files fail, attached disk keeps running until restart), schedule deletion / cancel, wait out → gone for good.
4. **Who holds the key?** (explore): cloud-managed / your KMS key / held outside (XKS, EKM, SSE-C); costs; TLS in transit.
5. **Where secrets belong** (explore): code, plain Kubernetes Secrets vs secret managers; AWS/Azure/Google/Vault/OpenBao; DPDP Rule 6.
6. **What still opens?** (sort checkpoint).
7. **Wrap**.
