# Sources: Webhooks and async APIs (fact-checked 2026-10-04)

- Stripe webhooks (Stripe-Signature; libraries' 5-minute default tolerance; retries up to three days in live mode; duplicates; no ordering guarantee; return 2xx quickly): https://docs.stripe.com/webhooks
- Stripe event destinations, thin events: https://docs.stripe.com/event-destinations
- GitHub webhooks (X-Hub-Signature-256; constant-time comparison; 10-second response; no automatic redelivery): https://docs.github.com/en/webhooks
- Razorpay webhooks (X-Razorpay-Signature; 24-hour retries then disabled; 5-second timeout): https://razorpay.com/docs/webhooks/
- Standard Webhooks specification: https://www.standardwebhooks.com/
- CloudEvents (CNCF graduated 25 Jan 2024): https://cloudevents.io/ ; AsyncAPI 3.1.0: https://www.asyncapi.com/
- OWASP Server-Side Request Forgery Prevention Cheat Sheet (custom webhooks).
- Jeff Lindsay, "Web hooks to revolutionize the web" (3 May 2007).

The shop, events and signatures are illustrative.
