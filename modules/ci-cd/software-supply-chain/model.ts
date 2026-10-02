/** Four real attacks, each at a different link of the chain, and the defence that fits it. */

export type Stage = "source" | "deps" | "build" | "dist";

export const STAGES: { id: Stage; name: string }[] = [
  { id: "source", name: "Source code" },
  { id: "deps", name: "Dependencies" },
  { id: "build", name: "Build system" },
  { id: "dist", name: "Distribution" },
];

export interface Attack {
  id: string;
  name: string;
  when: string;
  stage: Stage;
  story: string;
  options: { id: string; label: string; ok: boolean; why: string }[];
}

export const ATTACKS: Attack[] = [
  {
    id: "xz",
    name: "xz Utils",
    when: "2021 – Mar 2024",
    stage: "source",
    story:
      'Over about two years a contributor called "Jia Tan" earned maintainer rights to xz, a compression library inside most Linux systems, then hid a backdoor: the payload disguised as test files in the repository, and the step that switched it on only in the release tarballs. Andres Freund noticed SSH logins "taking a lot of CPU" and reported it on 29 March 2024, in versions 5.6.0 and 5.6.1, before most stable distributions shipped them.',
    options: [
      {
        id: "sign",
        label: "Sign the release",
        ok: false,
        why: "The release was published by a real maintainer; a signature would only have confirmed the wrong person.",
      },
      {
        id: "review",
        label:
          "Build from the reviewed source, check releases are reproducible from it, and require independent review",
        ok: true,
        why: "The switch lived only in the tarball, not the reviewed source: rebuilding from the repository and comparing would have shown a difference.",
      },
      {
        id: "scan",
        label: "Scan the package for known vulnerabilities",
        ok: false,
        why: "A brand-new backdoor isn't in any vulnerability database yet.",
      },
    ],
  },
  {
    id: "npm",
    name: "Shai-Hulud worm",
    when: "Sep 2025",
    stage: "deps",
    story:
      "Malicious versions of npm packages stole developers' and pipelines' tokens when installed, then used those tokens to publish infected versions of more packages. CISA's alert counted over 500 packages. Any pipeline that installed the newest matching version picked it up.",
    options: [
      {
        id: "lock",
        label:
          "Lockfiles, a waiting period before adopting new versions, no install scripts, and publishing without long-lived tokens",
        ok: true,
        why: "Pinned versions don't change on their own, a few days' delay lets the community spot a bad release, blocked install scripts can't run on install, and there's no stored token to steal.",
      },
      {
        id: "sbom",
        label: "Publish an SBOM",
        ok: false,
        why: "An SBOM lists what you shipped; it doesn't stop a bad version arriving.",
      },
      {
        id: "bigger",
        label: "Use bigger build runners",
        ok: false,
        why: "Speed has nothing to do with it.",
      },
    ],
  },
  {
    id: "solarwinds",
    name: "SolarWinds Orion",
    when: "2019 – 2020",
    stage: "build",
    story:
      "Attackers got into SolarWinds' build environment and planted malware (SUNSPOT) that swapped in a backdoored source file only while Orion was being built. The finished update was signed with SolarWinds' genuine certificate. Up to about 18,000 customers may have installed it.",
    options: [
      {
        id: "sig",
        label: "Check the update's signature",
        ok: false,
        why: "It was genuinely signed. A signature proves who built something, not that the build was clean.",
      },
      {
        id: "hardened",
        label:
          "Hardened, isolated, single-use build machines, with provenance and reproducible builds",
        ok: true,
        why: "That's SLSA Build level 3. An independent rebuild from the same source would also have produced different output.",
      },
      {
        id: "tests",
        label: "More unit tests",
        ok: false,
        why: "The malware was designed to stay quiet; tests check intended behaviour.",
      },
    ],
  },
  {
    id: "codecov",
    name: "Codecov uploader",
    when: "Jan – Apr 2021",
    stage: "dist",
    story:
      "Using a credential leaked from its image-building process, an attacker altered Codecov's Bash uploader script on its servers. Thousands of pipelines downloaded and ran it, and it quietly sent their environment variables, secrets included, to the attacker.",
    options: [
      {
        id: "verify",
        label:
          "Verify the script's checksum or signature before running it, and keep pipeline secrets short-lived",
        ok: true,
        why: "A changed file fails the check, and a stolen one-hour credential is worth little.",
      },
      {
        id: "cache",
        label: "Cache the script",
        ok: false,
        why: "Caching whatever was downloaded first doesn't tell you whether it was genuine.",
      },
      {
        id: "lint",
        label: "Lint the repository",
        ok: false,
        why: "The problem wasn't in your code.",
      },
    ],
  },
];

export const SLSA: { level: string; name: string; what: string; stops: string }[] = [
  {
    level: "L0",
    name: "No guarantees",
    what: "No provenance at all.",
    stops: "Nothing in particular.",
  },
  {
    level: "L1",
    name: "Provenance exists",
    what: "The build produces a record of how the package was built.",
    stops: "Mistakes, and missing documentation of what went in.",
  },
  {
    level: "L2",
    name: "Hosted build platform",
    what: "Signed provenance, generated by a hosted build platform.",
    stops: "Tampering after the build.",
  },
  {
    level: "L3",
    name: "Hardened builds",
    what: "A hardened build platform that isolates builds from each other and protects its signing keys.",
    stops: "Tampering during the build.",
  },
];
