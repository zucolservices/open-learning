# Sources: Encryption and TLS (fact-checked 2026-10-07)

- TLS 1.3, RFC 8446 (Aug 2018): one-round-trip handshake; removed non-forward-secret key exchanges. TLS 1.0/1.1 deprecated by RFC 8996 (Mar 2021).
- Let's Encrypt: first certificate 14 Sep 2015, open to all 3 Dec 2015; >700M websites. CA/Browser Forum SC-081: max TLS certificate validity 200 days (from 15 Mar 2026), 100 (Mar 2027), 47 (Mar 2029).
- Google Transparency Report / Chrome Security blog: ~95%+ of Chrome page loads over HTTPS; Chrome 154 (Oct 2026) "Always Use Secure Connections".
- Heartbleed, CVE-2014-0160 (Apr 2014, OpenSSL). AES-GCM, ChaCha20-Poly1305 (TLS 1.3 AEAD ciphers). ECB penguin (Wikipedia). Adobe 2013: ~153M records, 3DES-ECB.
- KMS/envelope encryption: AWS KMS, Google Cloud KMS, Azure Key Vault docs. NIST FIPS 203/204/205 (13 Aug 2024). Chrome X25519MLKEM768 default since Chrome 131 (Nov 2024); ~two-thirds of Cloudflare human traffic PQ by early 2026.

The café-Wi-Fi session is illustrative.
