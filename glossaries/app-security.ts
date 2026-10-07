import type { GlossaryEntry } from "./types";

/** Application Security track glossary. `module` slugs refer to this track. */
export const appSecurity = {
  vulnerability: {
    term: "Vulnerability",
    definition:
      "A weakness in software, configuration or process that someone could use to cause harm, such as an unpatched flaw or a missing check.",
    module: "why-appsec",
  },
  threat: {
    term: "Threat",
    definition:
      "Anyone or anything that could exploit a vulnerability to cause harm, such as a criminal group, a malicious insider or a careless mistake.",
    module: "why-appsec",
  },
  risk: {
    term: "Risk",
    definition:
      "How likely harm is combined with how bad it would be; used to decide which problems to fix first.",
    module: "why-appsec",
  },
  patch: {
    term: "Patch",
    definition:
      "An update that fixes a flaw in software. Many breaches use flaws whose patch was already available.",
    module: "why-appsec",
  },
  exploit: {
    term: "Exploit",
    definition:
      "To use a vulnerability to make a system do something it shouldn't; also the code or technique that does it.",
    module: "why-appsec",
  },
  "shift-left": {
    term: "Shift left",
    definition:
      "Doing security (and testing) earlier in building software, in design and coding rather than just before or after release.",
    module: "why-appsec",
  },
  "threat-modelling": {
    term: "Threat modelling",
    definition:
      "Looking at a design to find what could go wrong and decide what to do about it, ideally before building it.",
    module: "threat-modelling",
  },
  "data-flow-diagram": {
    term: "Data flow diagram",
    definition:
      "A sketch of a system showing outside people and systems, processes, data stores and the data flowing between them; the usual starting point for threat modelling.",
    module: "threat-modelling",
  },
  "trust-boundary": {
    term: "Trust boundary",
    definition:
      "A line in a system where data or control passes between parts with different levels of trust, such as from a user's browser to your server.",
    module: "threat-modelling",
  },
  stride: {
    term: "STRIDE",
    definition:
      "Six prompts for finding threats: Spoofing, Tampering, Repudiation, Information disclosure, Denial of service and Elevation of privilege (Microsoft, 1999).",
    module: "threat-modelling",
  },
  "least-privilege": {
    term: "Least privilege",
    definition:
      "Giving each person, program or service only the access it needs for its job, and nothing more.",
    module: "secure-design",
  },
  "defence-in-depth": {
    term: "Defence in depth",
    definition:
      "Stacking several independent layers of protection so that one failure doesn't lead to a breach.",
    module: "secure-design",
  },
  "insecure-design": {
    term: "Insecure design",
    definition:
      "Security flaws in the plan itself, such as no limit on what a role can see, which a perfect implementation can't fix (OWASP Top 10:2025 A06).",
    module: "secure-design",
  },
  owasp: {
    term: "OWASP",
    definition:
      "The Open Worldwide Application Security Project: a non-profit community (since 2001) that publishes free security guides, tools and lists such as the Top 10.",
    module: "owasp-top-ten",
  },
  cwe: {
    term: "CWE",
    definition:
      "Common Weakness Enumeration: MITRE's numbered catalogue of software weakness types, such as CWE-89 for SQL injection.",
    module: "owasp-top-ten",
  },
  asvs: {
    term: "ASVS",
    definition:
      "OWASP's Application Security Verification Standard: a detailed checklist of security requirements an application can be tested against (version 5.0, 2025).",
    module: "owasp-top-ten",
  },
  "sql-injection": {
    term: "SQL injection",
    definition:
      "A flaw where user input pasted into a database query's text changes what the query does, letting attackers read or change data.",
    module: "sql-injection",
  },
  "parameterised-query": {
    term: "Parameterised query",
    definition:
      "A database query written with placeholders, with the values sent separately, so input is always treated as data and never as part of the command. Also called a prepared statement.",
    module: "sql-injection",
  },
  xss: {
    term: "Cross-site scripting (XSS)",
    definition:
      "A flaw where a site includes untrusted input in its pages so that the browser runs it as the site's own code, letting attackers act as the visitor.",
    module: "xss",
  },
  "output-encoding": {
    term: "Output encoding",
    definition:
      "Converting untrusted data into a form that is displayed as text in its exact context (HTML, attribute, JavaScript, URL) instead of being run as code; the main defence against XSS.",
    module: "xss",
  },
  interpreter: {
    term: "Interpreter",
    definition:
      "Any software that reads text and acts on it as instructions, such as a shell, a database, a template engine or a browser. Injection targets interpreters.",
    module: "other-injection",
  },
  "command-injection": {
    term: "Command injection",
    definition:
      "A flaw where user input placed in an operating-system command lets an attacker run extra commands on the server.",
    module: "other-injection",
  },
} satisfies Record<string, GlossaryEntry>;
