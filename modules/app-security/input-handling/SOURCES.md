# Sources: Validation and safe parsing (fact-checked 2026-10-07)

- OWASP Input Validation Cheat Sheet (allowlist; syntax and semantics; client-side validation is bypassable; validation doesn't replace other controls).
- OWASP File Upload Cheat Sheet (extension allowlist, don't trust Content-Type, rename, size limits, store outside webroot, scan if available).
- Python docs, pickle warning. Frohoff & Lawrence, AppSecCali (Jan 2015); Foxglove Security (6 Nov 2015), Apache Commons Collections.
- CWE-611 (XXE), CWE-776 (entity expansion), CWE-22 (path traversal, #6 in CWE Top 25 2025). OWASP Top 10:2025 A02 and A08. The decompression-bomb image is an illustrative case.
- Cloudflare post-mortem, 2 July 2019 outage (27 minutes, WAF regex). Stack Exchange post-mortem, 20 July 2016 (34 minutes).

The upload simulation is rules-based; files are described, not real.
