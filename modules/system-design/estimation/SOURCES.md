# Sources: Back-of-the-envelope estimation

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-foundations/`).

| Claim in the module                                                                                                         | Verdict                                 | Source                                                            |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------- |
| 86,400 s/day; month ≈ 2.6M s; 1M/day ≈ 12/s                                                                                 | Verified (arithmetic)                   | —                                                                 |
| Peak = 2–10× average is a rule of thumb only; measure yours                                                                 | Nuanced (no primary source)             | sre.google/sre-book/service-best-practices/ (plan for peak)       |
| 1 Gbps = 125 MB/s (decimal)                                                                                                 | Verified                                | physics.nist.gov/cuu/Units/binary.html                            |
| L1 ~1 ns; DRAM ~60–100 ns                                                                                                   | Verified                                | Gregg, _Systems Performance_                                      |
| NVMe 4 KB random read ~75 µs (QD1 spec), higher under load                                                                  | Verified                                | Solidigm D7-P5520 spec via Lenovo Press LP2077                    |
| Same-DC round trip ~0.1–0.5 ms (measured rule of thumb, no vendor figure); cross-AZ "single-digit ms" (AWS), <≈2 ms (Azure) | Nuanced                                 | AWS fault isolation whitepaper; Azure availability zones overview |
| California ↔ Netherlands ~146 ms round trip (Azure West US ↔ West Europe median)                                            | Verified                                | learn.microsoft.com/azure/networking/azure-network-latency        |
| Light in fibre ~200 km/ms                                                                                                   | Verified (physics)                      | —                                                                 |
| UPI Aug 2026: 24.51 billion transactions (~791M/day)                                                                        | Verified via press reports of NPCI data | business-standard.com (NPCI figures)                              |
