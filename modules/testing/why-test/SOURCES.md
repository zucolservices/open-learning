# Sources: Why test (fact-checked 2026-10-11)

- Cost of late bugs: the "100x" IBM Systems Sciences Institute figure is untraceable (Pressman 1987 citing IBM course notes; Bossavit; The Register 2021). Boehm & Basili (2001): ~100:1 for large systems, ~5:1 for small. Menzies et al. (2016): no consistent delayed-issue effect across 171 projects. Hence "no fixed multiplier".
- Dijkstra, "Program testing can be used to show the presence of bugs, but never to show their absence" (NATO 1969 / 1970 notes); also ISTQB CTFL v4.0.1 principle 1.
- Ariane 5 flight 501 (4 June 1996): Inquiry Board report; 64-bit float to 16-bit signed integer conversion in SRI code reused from Ariane 4, ~37 s after lift-off.
- Knight Capital (1 Aug 2012): SEC order (Oct 2013) and 10-Q, ~$460m (pre-tax $461.1m) in ~45 minutes; one of eight SMARS servers not updated; reused flag woke dead "Power Peg" code.
- CrowdStrike (19 Jul 2024): CrowdStrike RCA (6 Aug 2024): IPC template defined 21 input fields, sensor supplied 20; tests used a wildcard in the 21st field; staged rollout adopted. 8.5 million devices is Microsoft's estimate (20 Jul 2024).

Full notes: scratchpad `sd/testing/m01-facts.md`. The café, Noor and the three bugs are made up; fix times are illustrative.
