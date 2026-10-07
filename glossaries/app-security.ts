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
  "input-validation": {
    term: "Input validation",
    definition:
      "Checking that data from outside matches what you expect (type, length, format, range, meaning) and rejecting the rest, on the server.",
    module: "input-handling",
  },
  "allow-list": {
    term: "Allow-list",
    definition:
      "A list of what is permitted, with everything else rejected; safer than a deny-list, which tries to name everything forbidden.",
    module: "input-handling",
  },
  deserialisation: {
    term: "Deserialisation",
    definition:
      "Turning stored or transmitted bytes back into program objects. Doing it on untrusted data with some formats can run an attacker's code.",
    module: "input-handling",
  },
  "password-hash": {
    term: "Password hash",
    definition:
      "A one-way scrambled form of a password that a server stores instead of the password; logins are checked by hashing the attempt and comparing.",
    module: "passwords",
  },
  salt: {
    term: "Salt",
    definition:
      "A random value stored with each password hash so that identical passwords hash differently and attackers must crack each one separately.",
    module: "passwords",
  },
  "credential-stuffing": {
    term: "Credential stuffing",
    definition:
      "Trying usernames and passwords leaked from one site on many other sites, betting that people reuse passwords.",
    module: "passwords",
  },
  mfa: {
    term: "Multi-factor authentication (MFA)",
    definition:
      "Logging in with proofs of at least two different kinds: something you know, something you have, or something you are.",
    module: "mfa-passkeys",
  },
  passkey: {
    term: "Passkey",
    definition:
      "A login credential based on a key pair: the private key stays on your device or password manager, and the browser only uses it on the site it was created for, so it resists phishing.",
    module: "mfa-passkeys",
  },
  "phishing-resistant": {
    term: "Phishing-resistant authentication",
    definition:
      "Login methods that protect users even if they are fooled by a fake site, because the browser or device checks which site is asking (passkeys, FIDO2 security keys).",
    module: "mfa-passkeys",
  },
  session: {
    term: "Session",
    definition:
      "The period a user stays logged in, tracked by a session ID or token the browser sends with every request; whoever holds it is treated as that user.",
    module: "sessions-tokens",
  },
  jwt: {
    term: "JWT (JSON Web Token)",
    definition:
      "A compact token carrying claims such as user and expiry, usually signed but not encrypted, so its contents are readable by anyone who holds it.",
    module: "sessions-tokens",
  },
  authentication: {
    term: "Authentication",
    definition: "Checking who someone is, for example with a password, passkey or session cookie.",
    module: "access-control",
  },
  authorisation: {
    term: "Authorisation",
    definition:
      "Deciding whether an authenticated user may perform a specific action on a specific object.",
    module: "access-control",
  },
  idor: {
    term: "IDOR",
    definition:
      "Insecure direct object reference: changing an identifier in a request (such as an invoice number) reaches someone else's data because ownership isn't checked. Called BOLA in APIs.",
    module: "access-control",
  },
  oauth: {
    term: "OAuth",
    definition:
      "A standard that lets one app get limited, revocable access to your data at another service without seeing your password (OAuth 2.0, RFC 6749).",
    module: "oauth-oidc",
  },
  oidc: {
    term: "OpenID Connect (OIDC)",
    definition:
      "A login layer on top of OAuth: it adds an ID token that tells an app who signed in. Behind most “Sign in with…” buttons.",
    module: "oauth-oidc",
  },
  pkce: {
    term: "PKCE",
    definition:
      "Proof Key for Code Exchange: the app proves it started the sign-in by revealing a secret whose hash it sent earlier, so a stolen authorisation code is useless.",
    module: "oauth-oidc",
  },
  csrf: {
    term: "Cross-site request forgery (CSRF)",
    definition:
      "An attack where a page you visit makes your browser send a request to a site you're logged into; the browser adds your cookies, so the site thinks you asked for it.",
    module: "csrf-cors",
  },
  samesite: {
    term: "SameSite",
    definition:
      "A cookie setting (Strict, Lax or None) that tells the browser whether to send the cookie on requests started by other sites.",
    module: "csrf-cors",
  },
  "same-origin-policy": {
    term: "Same-origin policy",
    definition:
      "The browser rule that a page's scripts may not read data from a different origin (scheme, host and port).",
    module: "csrf-cors",
  },
  cors: {
    term: "CORS",
    definition:
      "Cross-origin resource sharing: headers a server sends to let pages from named other origins read its responses. It controls reading, not sending, so it doesn't stop CSRF.",
    module: "csrf-cors",
  },
} satisfies Record<string, GlossaryEntry>;
