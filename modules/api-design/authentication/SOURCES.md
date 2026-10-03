# Sources: Authentication: keys, OAuth and tokens (fact-checked 2026-10-04)

- RFC 6749 OAuth 2.0 (Oct 2012); RFC 6750 Bearer tokens (Oct 2012).
- Eran Hammer-Lahav, "Explaining OAuth" (2007): the valet key analogy.
- RFC 7636 PKCE (Sept 2015); RFC 9700 OAuth 2.0 Security Best Current Practice (Jan 2025): password grant MUST NOT; implicit SHOULD NOT; PKCE required for public clients.
- draft-ietf-oauth-v2-1 (revision 16, Sept 2026; still a draft).
- OpenID Connect Core 1.0 ("a simple identity layer on top of the OAuth 2.0 protocol"; ID Token as JWT); ISO/IEC 26131:2024.
- RFC 7519 JWT (May 2015); RFC 8725 JWT Best Current Practices (Feb 2020).
- Google Cloud API keys docs (standard keys identify a project; restrict keys); GitHub secret scanning docs.
- DigiLocker Requester API Specification v1.12 (OAuth 2.0, PKCE).
- RFC 8705 OAuth 2.0 Mutual-TLS (Feb 2020).

The shop app, flow values and tokens are illustrative; the tokens are real base64url encodings of the JSON shown.
