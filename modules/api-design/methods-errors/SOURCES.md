# Sources: Methods, status codes and errors (fact-checked 2026-10-03)

- RFC 9457 "Problem Details for HTTP APIs" (July 2023, obsoletes RFC 7807): https://www.rfc-editor.org/rfc/rfc9457
- RFC 9110 status codes (401 + WWW-Authenticate; 405 + Allow; 201 + Location or target URI; 403 may be hidden as 404; 422 "Unprocessable Content"; 503 Retry-After MAY; 301 vs 308) and the idempotent definition (§9.2.2): https://www.rfc-editor.org/rfc/rfc9110
- RFC 5789 PATCH (not safe or idempotent); RFC 7396 JSON Merge Patch (null removes).
- GitHub docs: "GitHub uses a 404 Not Found response instead of a 403 Forbidden response to avoid confirming the existence of private repositories."
- Stripe API errors (type, code, message, param, doc_url): https://docs.stripe.com/api/errors

The orders and transfer examples are illustrative.
