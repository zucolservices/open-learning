# Storyboard: Idempotency and safe retries

1. **The lift button** (story): lift vs vending machine.
2. **Pay ₹500, once** ⭐ (simulation): three network failures × key on/off; timeline and charge count.
3. **How the server remembers** (explore): key table; replay / 409 / 422 / 400; Stripe, PayPal, AWS.
4. **Retrying politely** (explore): backoff, jitter, limits, Retry-After.
5. **Safe to retry?** (checkpoint `safe-to-retry`).
6. **What to remember** (wrap).
