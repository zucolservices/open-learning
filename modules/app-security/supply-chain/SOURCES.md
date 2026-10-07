# Sources: Dependencies and the supply chain (fact-checked 2026-10-07)

- Log4Shell, CVE-2021-44228 (9 Dec 2021, CVSS 10); fixes through Log4j 2.17.1.
- SolarWinds Orion (disclosed Dec 2020): "fewer than 18,000" customers installed the tainted update (SEC).
- xz utils backdoor, CVE-2024-3094 (found 29 Mar 2024 by Andres Freund; "Jia Tan" over 2+ years).
- Dependency confusion (Alex Birsan, Feb 2021). Sept 2025 chalk/debug maintainer phishing (~2B weekly downloads); Shai-Hulud worm (Sept & Nov 2025); successor worms 2026. Trivy release/Action briefly trojanised (Mar 2026, TeamPCP).
- npm response: provenance GA (26 Sep 2023), trusted publishing/OIDC (31 Jul 2025), classic tokens revoked (9 Dec 2025), staged publishing (22 May 2026), npm 12 no longer runs install scripts by default (8 Jul 2026).
- SBOM: SPDX (ISO/IEC 5962:2021), CycloneDX (ECMA-424). SLSA v1.2 (24 Nov 2025). Sigstore (cosign, Rekor). Dependabot, Renovate, OSV-Scanner, Trivy, Grype.
- EU Cyber Resilience Act: in force 10 Dec 2024; reporting duty from 11 Sep 2026; main obligations 11 Dec 2027.

The dependency tree and the vulnerable package are illustrative.
