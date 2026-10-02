# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m01-facts.md` (raw pages in `obs/m01/`).

- R. E. Kálmán, "On the general theory of control systems" (First IFAC Congress, 1960): observability in control theory. Honeycomb "first borrowed the term" for software in 2016.
- Majors, Fong-Jones & Miranda, _Observability Engineering_ (O'Reilly, 2022): "If you can understand any bizarre or novel state without needing to ship new code, you have observability."
- Google, _Site Reliability Engineering_, ch. 6: monitoring is "Collecting, processing, aggregating, and displaying real-time quantitative data about a system, such as query counts and types, error counts and types, processing times, and server lifetimes."
- OpenTelemetry, "Observability primer": "Observability lets you understand a system from the outside by letting you ask questions about that system without knowing its inner workings. Furthermore, it allows you to easily troubleshoot and handle novel problems, that is, 'unknown unknowns'. It also helps you answer the question 'Why is this happening?'"
- Slack Engineering, "Slack's Outage on January 4th 2021" (Laura Nolan, 1 Feb 2021): waiting threads caused CPU utilisation to drop, which "initially triggered some automated downscaling"; the dashboarding and alerting service became unavailable.
- Roblox, "Roblox Return to Service 10/28-10/31 2021": "Critical monitoring systems … relied on affected systems, such as Consul. This combination severely hampered the triage process."
- The payments app, its banks (named A–E), the 2,000 requests and the timeline are illustrative.
