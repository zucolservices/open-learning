# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m04-facts.md` (raw pages in `cicd/m04/`).

- npm blog, "kik, left-pad, and npm" (March 2016): 273 packages unpublished on 22 March 2016; left-pad restored; Babel and Atom named among affected projects; about 2.5 hours of disruption.
- colors.js 1.4.1 published 8 January 2022 with an infinite loop (also 1.4.44-liberty-2); faker 6.6.6 the same week.
- npm docs, `npm ci`: requires an existing lockfile; errors if it doesn't match package.json "instead of updating the package lock"; removes node_modules first; "installs are essentially frozen". npm semver: `^1.2.3` := `>=1.2.3 <2.0.0`, `~1.2.3` := `>=1.2.3 <1.3.0`.
- reproducible-builds.org definition (quoted). Bazel docs on hermeticity: isolating the build from changes to the host system.
- PEP 751 (pylock.toml) accepted 31 March 2025. go.sum holds checksums; versions come from go.mod (minimal version selection). Gradle and .NET locking are opt-in; Maven has no built-in lockfile. `cargo build --locked`, `uv sync --locked`, `pnpm install --frozen-lockfile`.
- GitHub Docs, dependency caching: key and restore-keys, `hashFiles()` on the lockfile, caches unused for 7 days are evicted, 10 GB per repository included (raisable, billed, since November 2025).
- GitLab Docs: cache for dependencies, artifacts to pass build results between stages.
- The five builds, Node versions on the runner and all timings are illustrative.
