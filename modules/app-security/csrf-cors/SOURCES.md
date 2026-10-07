# Sources: CSRF, CORS and the same-origin policy (fact-checked 2026-10-07)

- RFC 6454, The Web Origin Concept (2011). Netscape Navigator 2 (1995–96) introduced the same-origin policy alongside JavaScript.
- OWASP CSRF Prevention Cheat Sheet: synchronizer token, signed double-submit cookie, Fetch Metadata (Sec-Fetch-Site), SameSite as defence in depth.
- Chrome SameSite Lax-by-default (2020); Firefox and Safari do not default (verified 2026). RFC 6265bis in the RFC Editor queue.
- WHATWG Fetch standard (CORS); W3C CORS Recommendation (Jan 2014, retired 2020). James Kettle, "Exploiting CORS misconfigurations for Bitcoins and bounties", PortSwigger (14 Oct 2016).
- Zeller & Felten, "Cross-Site Request Forgeries: Exploitation and Prevention" (Princeton, 2008). Go 1.25 CrossOriginProtection (Aug 2025).
- OWASP Top 10 2017 (CSRF removed); MITRE CWE Top 25 2025: CWE-352 #3.

The forged-transfer lab is a rules-based simulation with placeholder domains.
