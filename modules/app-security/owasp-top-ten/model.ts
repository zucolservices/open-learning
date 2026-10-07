/** The OWASP Top 10:2025, with a real incident and the module in this track that covers each. */

export interface Risk {
  code: string;
  name: string;
  plain: string;
  was: string;
  incident: string;
  modules: string;
}

export const TOP10: Risk[] = [
  {
    code: "A01",
    name: "Broken Access Control",
    plain: "Users can see or do things they shouldn't, like another customer's data.",
    was: "A01; SSRF, now part of it, was A10",
    incident:
      "First American Financial, 2019: changing a document link showed other customers' files, about 800 million images.",
    modules: "Broken access control; Server-side request forgery",
  },
  {
    code: "A02",
    name: "Security Misconfiguration",
    plain:
      "Unsafe settings: default passwords, open storage, verbose errors, risky parser options.",
    was: "A05",
    incident:
      "Capital One, 2019: a misconfigured firewall helped an attacker reach cloud credentials and data on over 100 million people.",
    modules: "Security headers and CSP; Validation and safe parsing",
  },
  {
    code: "A03",
    name: "Software Supply Chain Failures",
    plain: "Problems in the code and tools you depend on: libraries, build systems, updates.",
    was: "new; it widens “Vulnerable and Outdated Components” (A06)",
    incident:
      "SolarWinds, 2020: a malicious change to a software build reached about 18,000 organisations through an update.",
    modules: "Dependencies and the supply chain",
  },
  {
    code: "A04",
    name: "Cryptographic Failures",
    plain: "Data not encrypted, or encrypted badly: weak algorithms, poor key handling.",
    was: "A02",
    incident:
      "Adobe, 2013: over 150 million passwords were encrypted with a weak mode instead of hashed, so identical passwords looked identical.",
    modules: "Encryption and TLS; Passwords and authentication",
  },
  {
    code: "A05",
    name: "Injection",
    plain: "Input is treated as code: SQL injection, cross-site scripting, command injection.",
    was: "A03",
    incident:
      "MOVEit Transfer, 2023: a SQL injection let a criminal gang steal files from about 2,770 organisations.",
    modules: "SQL injection; Cross-site scripting; Command, template and other injection",
  },
  {
    code: "A06",
    name: "Insecure Design",
    plain: "Flaws in the plan itself that no amount of careful coding can fix.",
    was: "A04",
    incident:
      "Sarah Palin's email, 2008: taken over by answering password-reset questions from public facts.",
    modules: "Threat modelling; Secure design principles",
  },
  {
    code: "A07",
    name: "Authentication Failures",
    plain: "Weak logins: guessable passwords, no MFA, sessions that never expire.",
    was: "A07, as “Identification and Authentication Failures”",
    incident:
      "Change Healthcare, 2024: stolen credentials worked on a remote-access portal with no multi-factor authentication.",
    modules: "Passwords; MFA and passkeys; Sessions, cookies and tokens",
  },
  {
    code: "A08",
    name: "Software or Data Integrity Failures",
    plain: "Trusting code or data without checking it hasn't been tampered with.",
    was: "A08, as “Software and Data Integrity Failures”",
    incident:
      "Codecov, 2021: an altered upload script quietly sent customers' secrets to attackers.",
    modules: "Validation and safe parsing; Dependencies and the supply chain",
  },
  {
    code: "A09",
    name: "Security Logging & Alerting Failures",
    plain: "Attacks happen but nobody notices, because logs or alerts are missing.",
    was: "A09, as “Security Logging and Monitoring Failures”",
    incident:
      "Equifax, 2017: an expired certificate blinded traffic monitoring; attackers went unnoticed for 76 days.",
    modules: "Logging, detection and response",
  },
  {
    code: "A10",
    name: "Mishandling of Exceptional Conditions",
    plain: "Errors handled badly: crashes, leaked details, or checks that fail open.",
    was: "not on the list (new in 2025)",
    incident:
      "Apple “goto fail”, 2014: a slip in error-handling code skipped a TLS certificate check.",
    modules: "Secure design principles",
  },
];

export const LISTS: { name: string; what: string; top: string }[] = [
  {
    name: "OWASP Top 10 (2025)",
    what: "Awareness: the ten most important web application risks.",
    top: "Broken Access Control",
  },
  {
    name: "OWASP ASVS 5.0 (2025)",
    what: "A detailed checklist you can test an application against.",
    top: "Hundreds of verifiable requirements, in three levels",
  },
  {
    name: "OWASP API Security Top 10 (2023)",
    what: "Risks specific to APIs.",
    top: "Broken Object Level Authorization",
  },
  {
    name: "OWASP Top 10 for LLM Applications (2025)",
    what: "Risks in apps built on large language models.",
    top: "Prompt Injection",
  },
  {
    name: "CWE Top 25 (MITRE, Dec 2025)",
    what: "The most dangerous individual software weaknesses, ranked from real CVE data.",
    top: "Cross-site scripting, then SQL injection",
  },
];
