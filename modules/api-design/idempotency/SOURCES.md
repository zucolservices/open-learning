# Sources: Idempotency and safe retries (fact-checked 2026-10-03)

- RFC 9110 §9.2.2 (idempotent; "can be repeated automatically if a communication failure occurs before the client is able to read the server's response"): https://www.rfc-editor.org/rfc/rfc9110
- IETF Internet-Draft "The Idempotency-Key HTTP Header Field", draft-ietf-httpapi-idempotency-key-header-07 (Oct 2025; expired Apr 2026; not an RFC): https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/
- Stripe idempotent requests: https://docs.stripe.com/api/idempotent_requests
- AWS Builders' Library, Malcolm Featonby, "Making retries safe with idempotent APIs": https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/
- PayPal-Request-Id: https://developer.paypal.com/api/rest/reference/idempotency/ ; EC2 RunInstances ClientToken.
- Marc Brooker, "Exponential Backoff And Jitter" (AWS Architecture Blog, 4 Mar 2015).
- Brandur Leach, "Implementing Stripe-like Idempotency Keys in Postgres" (27 Oct 2017).

Timelines are illustrative.
