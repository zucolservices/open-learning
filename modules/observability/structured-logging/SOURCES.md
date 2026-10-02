# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m08-facts.md` (raw pages in `obs/m07/`).

- The Twelve-Factor App, "XI. Logs": "Treat logs as event streams"; each process "writes its event stream, unbuffered, to stdout".
- OpenTelemetry Logs data model: Timestamp, ObservedTimestamp, SeverityText, SeverityNumber, Body, Attributes, TraceId, SpanId, TraceFlags, Resource, InstrumentationScope, EventName.
- OWASP Logging Cheat Sheet, "Data to exclude": session identifiers, access tokens, passwords, database connection strings, encryption keys and other primary secrets, payment card holder data, sensitive personal data.
- PCI DSS v4.0.1: sensitive authentication data (such as card security codes) not retained after authorisation (Req. 3.3.1); PAN rendered unreadable wherever stored (Req. 3.5.1).
- India's Digital Personal Data Protection Act 2023 and Rules (notified 14 Nov 2025): reasonable security safeguards; erasure when the purpose ends.
- Twitter, 3 May 2018: "passwords were written to an internal log before completing the hashing process."
- Log4Shell, CVE-2021-44228 (published 10 Dec 2021, CVSS 10.0).
- The log lines, orders, banks and the redacted example are illustrative (the card number is a standard test number).
