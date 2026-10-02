# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m01-facts.md` (raw pages in `cicd/m01/`).

- Martin Fowler, "Continuous Integration" (revised 18 Jan 2024): "each member of a team merges their changes into a codebase together with their colleagues changes at least daily. Each of these integrations is verified by an automated build (including test)"; "integration hell"; CI on long-lived feature branches "isn't Continuous Integration at all". https://martinfowler.com/articles/continuousIntegration.html
- Jez Humble, continuousdelivery.com: "the ability to get changes of all types … into production, or into the hands of users, safely and quickly in a sustainable way". https://continuousdelivery.com/
- Martin Fowler, bliki "ContinuousDelivery" (2013/2014): continuous deployment means "every change goes through the pipeline and automatically gets put into production"; "In order to do Continuous Deployment you must be doing Continuous Delivery."
- US SEC, Release No. 34-70694 (16 Oct 2013), Knight Capital: code deployed in stages from 27 July 2012; a technician "did not copy the new code to one of the eight SMARS computer servers"; no second-person review; about 45 minutes; "Knight lost more than $460 million". https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf
- John Allspaw & Paul Hammond, "10+ Deploys Per Day: Dev and Ops Cooperation at Flickr", Velocity 2009.
- DORA, "Working in small batches": small batches "reduce the time it takes to get feedback on changes, making it easier to triage and remediate problems". DORA metrics guide: "speed and stability are not tradeoffs". https://dora.dev/
- The checkout team, its branches, the 260 and 240 change counts and the seven bugs are illustrative.
