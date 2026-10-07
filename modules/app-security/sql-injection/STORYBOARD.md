# Storyboard: SQL injection

1. **A form with a blank to fill** (story): a payment-slip analogy.
2. **Watch the query change** ⭐ (simulation): normal vs described crafted inputs; string-built vs parameterised; how the database reads the input.
3. **The fix, and the backups** (explore): parameterised code; ORM builder vs raw; allow-lists, least privilege, no escaping.
4. **Twenty-five years of the same bug** (explore): Phrack 1998, Heartland, TalkTalk, MOVEit, CWE Top 25.
5. **Safe or not?** (checkpoint `sqli-safe`).
6. **What to remember** (wrap).
