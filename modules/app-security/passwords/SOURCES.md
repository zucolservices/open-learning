# Sources: Passwords and authentication (fact-checked 2026-10-07)

- NIST SP 800-63B-4 (July 2025; announced 1 Aug 2025): 15-character minimum for single-factor passwords (8 with MFA), no composition rules, no periodic changes, blocklist checks, password managers allowed, failed attempts limited to 100.
- OWASP Password Storage Cheat Sheet (edited 2026-10-04): Argon2id (19 MiB, t=2, p=1), scrypt, bcrypt (legacy; cost ≥10; 72 bytes), PBKDF2-HMAC-SHA256 600,000 iterations. RFC 9106 (Argon2, Sept 2021). Provos & Mazières, bcrypt (USENIX 1999).
- Hashcat benchmarks (Chick3nman gists): RTX 5090 MD5 220.6 GH/s, bcrypt cost 5 304.8 kH/s. Cost 10 figure is scaled (÷32), an estimate.
- RockYou (2009, 32M plaintext; FTC, Imperva). LinkedIn (2012; HIBP: 164.6M accounts, ~117M hashes, 2016).
- Have I Been Pwned Pwned Passwords range API (k-anonymity, 5-character SHA-1 prefix). The example hash prefix shown is illustrative.
- Verizon 2025 DBIR: median 19% of daily authentication attempts at SSO providers were credential stuffing.

Crack times are arithmetic estimates for a guess list of one billion passwords and a million users.
