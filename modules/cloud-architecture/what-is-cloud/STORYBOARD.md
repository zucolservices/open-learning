# What the cloud really is: storyboard

1. **From a cupboard to the cloud** (scroll story): the server cupboard (on premises, five-year guesses) → guessing wrong (a results-portal demand curve against fixed capacity: idle grey, outage spike) → 2006 (S3 in March, EC2 beta in August; capacity follows demand; per-second/minute billing) → the NIST definition (five traits as cards; elasticity) → today (regions and zones per provider from their own pages, Oct 2026; Synergy Research Q2 2026 share estimate; IEA data-centre power).
2. **Who manages what** (explore): an eight-layer stack (data and access at the top, building at the bottom); on premises / IaaS / PaaS / SaaS move the "you vs provider" line; examples per model across AWS, Azure, Google Cloud and OpenStack; data and access always yours; private cloud ≠ on premises.
3. **Own or rent?** ⭐ (simulation, illustrative numbers, labelled): three made-up yearly demand curves (results portal, payroll, steady records system); slider for servers owned; overload days, utilisation, own vs rent cost with renting at 2.5× per server-day. Results: owning for the peak ≈ 5× renting; steady system owning ≈ half of renting; payroll close. 37signals as a real (self-reported) example.
4. **IaaS, PaaS or SaaS?** (sort checkpoint): six services.
5. **What to remember**.

Data: `demand.ts` (made-up curves and unit costs, deterministic). No model output.
