# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m02-facts.md` (raw pages in `cicd/m02/`).

- Pro Git, "Basic Branching and Merging": "If you changed the same part of the same file differently in the two branches you're merging, Git won't be able to merge them cleanly." https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging
- Git's first commit: Linus Torvalds, 7 April 2005 (git-scm.com, "A Short History of Git"; git history).
- Stack Overflow Developer Survey 2022 (the last to ask about version control): Git used by 93.87% of all respondents.
- Vincent Driessen, "A successful Git branching model" (2010) and its note of reflection (5 March 2020): "If your team is doing continuous delivery of software, I would suggest to adopt a much simpler workflow (like GitHub flow) instead of trying to shoehorn git-flow into your team." https://nvie.com/posts/a-successful-git-branching-model/
- GitHub Docs, "GitHub flow": "GitHub flow is a lightweight, branch-based workflow."
- DORA, "Trunk-based development": "Have three or fewer active branches … Merge branches to trunk at least once a day. Don't have code freezes and don't have integration phases." https://dora.dev/capabilities/trunk-based-development/
- Google Engineering Practices, "Small CLs": "Working on a large CL takes a long time, so you will have lots of conflicts when you merge".
- Pete Hodgson, "Feature Toggles (aka Feature Flags)" (martinfowler.com, 2016): release toggles let unfinished work ship "as latent code".
- Potvin & Levenberg, "Why Google Stores Billions of Lines of Code in a Single Repository", CACM July 2016: 25,000+ developers on one trunk.
- The five developers, twelve files and the edit pattern in the simulation are illustrative.
