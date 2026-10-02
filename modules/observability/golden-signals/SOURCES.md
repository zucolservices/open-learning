# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m07-facts.md` (raw pages in `obs/m07/`).

- Google, _Site Reliability Engineering_, ch. 6 "Monitoring Distributed Systems": "If you can only measure four metrics of your user-facing system, focus on these four"; definitions of latency ("a slow error is even worse than a fast error!"), traffic, errors (explicit, implicit, by policy) and saturation ("emphasizing the resources that are most constrained"); "Latency increases are often a leading indicator of saturation"; monitoring "should address two questions: what's broken, and why?".
- Tom Wilkie, "The RED Method: key metrics for microservices architecture" (Weaveworks blog, 13 May 2017; created around 2015): Rate, Errors, Duration; "100% based on" the golden signals.
- Brendan Gregg, "The USE Method" (2012): "For every resource, check utilization, saturation, and errors"; five-minute averages hid CPU hitting 100%.
- The three services and their signals are illustrative.
