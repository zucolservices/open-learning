# Sources: Complexity (fact-checked 2026-10-11)

- Thomas J. McCabe, "A Complexity Measure", IEEE TSE SE-2(4), Dec 1976: decisions + 1; ~10 as a reasonable upper limit. NIST SP 500-235 (1996) allows up to 15 with justification.
- G. Ann Campbell, "Cognitive Complexity: A new way of measuring understandability", SonarSource (2017; v1.7, Aug 2023): ignore readable shorthand, +1 per break in linear flow (a switch counts once), nesting increments.
- ESLint `complexity` rule default limit 20. Fowler, _Refactoring_: "Replace Nested Conditional with Guard Clauses".

Full notes: scratchpad `sd/clean-code/m08-facts.md`. The canRefund function is made up; scores are computed by hand from the rules above.
