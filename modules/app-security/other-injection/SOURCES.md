# Sources: Command, template and other injection (fact-checked 2026-10-07)

- OWASP Top 10:2025 A05 Injection (37 CWEs). MITRE CWE Top 25 2025: CWE-78 ranked #9.
- OWASP OS Command Injection Defense Cheat Sheet (avoid shells; argument injection). Python subprocess docs (security considerations, shell=True); Node.js child_process docs (exec vs execFile).
- James Kettle, "Server-Side Template Injection", PortSwigger Research (5 Aug 2015; Black Hat USA 2015). Jinja2 documentation.
- PortSwigger Web Security Academy, NoSQL injection (operator injection); OWASP WSTG, Testing for NoSQL Injection.
- Shellshock: CVE-2014-6271 (24 Sept 2014, Stéphane Chazelas). Log4Shell: CVE-2021-44228 (10 Dec 2021, CVSS 10.0, CWE-917).
- CVE-2024-21887 (Ivanti Connect Secure, 10 Jan 2024); CVE-2024-3400 (PAN-OS, 12 Apr 2024, CVSS 10.0); both in CISA KEV.

Attacks are described in words; no payloads are shown. Code samples are simplified.
