# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m18-facts.md` (raw pages in `cicd/m18/`). Attacks are described conceptually only.

- xz Utils (CVE-2024-3094): Andres Freund, oss-security, 29 Mar 2024 ("logins with ssh taking a lot of CPU"; "The upstream xz repository and the xz tarballs have been backdoored"); CISA alert 29 Mar 2024: versions 5.6.0 and 5.6.1. The payload was committed disguised as test files; the activating build step was only in the tarballs.
- Shai-Hulud npm worm: CISA alert 23 Sep 2025, over 500 packages; stole tokens and republished infected packages. Defences: lockfiles, minimum release age, blocking install scripts (pnpm v10 default), trusted publishing.
- SolarWinds: SEC 8-K (14 Dec 2020), "fewer than 18,000" customers may have installed the affected update; SUNSPOT build-time insertion (CrowdStrike; SolarWinds blog, Jan 2021); updates signed with SolarWinds' certificate.
- Codecov security update (Apr 2021): Bash uploader altered 31 Jan – 1 Apr 2021 via a credential leaked from its Docker image creation process.
- SBOM: NTIA minimum elements (Jul 2021) under Executive Order 14028 (12 May 2021); SPDX ISO/IEC 5962:2021; CycloneDX ECMA-424; EU Cyber Resilience Act (in force 10 Dec 2024; reporting obligations from 11 Sep 2026; full application 11 Dec 2027); CERT-In SBOM guidelines (3 Oct 2024, now v2.0). OSV, CISA KEV, Syft, Trivy, cdxgen, Dependabot, Renovate.
- SLSA v1.2 (24 Nov 2025): "Build L0: No guarantees", "Build L1: Provenance exists", "Build L2: Hosted build platform", "Build L3: Hardened builds"; new Source track.
- Sigstore GA 25 Oct 2022; npm provenance GA 26 Sep 2023; GitHub artifact attestations GA 25 Jun 2024; npm trusted publishing GA 31 Jul 2025.
- Alex Birsan, "Dependency Confusion" (9 Feb 2021): more than 35 organisations, including Apple and Microsoft.
- The SBOM snippet is illustrative.
