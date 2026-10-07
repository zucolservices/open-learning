# Sources: Sessions, cookies and tokens (fact-checked 2026-10-07)

- OWASP Session Management Cheat Sheet: ≥64 bits of entropy; regenerate on login and privilege change; idle/absolute timeout examples; never store tokens in localStorage/sessionStorage; __Host- prefix.
- Chrome SameSite Lax-by-default (Chrome 80, Feb 2020; resumed Jul 2020); Firefox and Safari do not default to Lax (Mozilla bug WONTFIX). RFC 6265bis (in the RFC Editor queue).
- RFC 7519 (JWT) and RFC 7515 (JWS), May 2015. Tim McLean, "Critical vulnerabilities in JSON Web Token libraries", Auth0 (31 Mar 2015). RFC 8725, JWT Best Current Practices (Feb 2020).
- Linus Tech Tips channel takeover (23 Mar 2023): malware disguised as a sponsorship PDF copied browser session tokens.
- Chrome Device Bound Session Credentials: Chrome 145 on Windows for all sites; Google accounts with Chrome 146 (9 Apr 2026). Spec is an Editor's Draft.

The session threats and cookie builder are illustrative.
