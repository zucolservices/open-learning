# Sources: Request and response design (fact-checked 2026-10-03)

- RFC 8259 JSON (Dec 2017, STD 90); RFC 7493 I-JSON §2.2 (integers outside ±(2^53−1) not exact; "RECOMMENDED to encode them in JSON string values"): https://www.rfc-editor.org/rfc/rfc7493
- MDN Number.MAX_SAFE_INTEGER (9007199254740991) and Number.EPSILON (0.1 + 0.2): https://developer.mozilla.org/
- X developer docs: "Always use string IDs in your code."
- Stripe: amounts in the smallest currency unit ("enter 1099 to charge 10.99 USD"); lowercase ISO currency codes: https://docs.stripe.com/currencies
- ISO 4217 List One (2026-09-17): INR minor unit 2.
- RFC 3339 (July 2002) and RFC 9557 (April 2024) timestamps.
- Google AIP-140 (lower_snake_case in proto; lowerCamelCase in JSON mapping), AIP-126 (_UNSPECIFIED); Azure guidelines ("DO use camel case for all JSON field names."); Zalando (snake_case property names; open-ended enums, "provide default behavior for unknown values").
- RFC 7396 JSON Merge Patch; JSON:API v1.1 (data / errors / meta).

The payment response is illustrative; the float sum and big-ID parse are computed live in the browser.
