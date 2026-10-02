# Identity and access (Cloud Architecture, module 9)

1. **Hotel key cards** (analogy): guest, housekeeping, manager cards; every door checks the card. IAM, policies, least privilege.
2. **Who, what, where** (explore): AWS / Azure / Google vocabulary side by side.
3. **Allowed or denied?** ⭐ (simulation): a real-syntax AWS policy for an analyst; pick a request, see the three-question evaluation (explicit deny → allow → boundary), toggle a read-only permissions boundary.
4. **Cut it down to size** ⭐ (fix the problem): nightly job with s3:* on *; narrow action and resource for read and write statements until only the two needed requests pass. Capital One 2019 story; Access Analyzer / role recommender.
5. **Predict the answer** (sort checkpoint): six requests across AWS, Azure (NotActions isn't a deny), Google (inheritance, deny policies).
6. **Wrap** (incl. mandatory MFA on all three clouds).
