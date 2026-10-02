# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m08-facts.md` (raw pages in `cicd/m08/`).

- Jez Humble & David Farley, _Continuous Delivery_ (2010), ch. 5, "Only Build Your Binaries Once": rebuilding risks "a different version of some third-party library that you didn't intend".
- The Twelve-Factor App, "V. Build, release, run": "a release cannot be mutated once it is created. Any change must create a new release."
- Semantic Versioning 2.0.0 (semver.org): MAJOR "incompatible API changes", MINOR "add functionality in a backward compatible manner", PATCH "backward compatible bug fixes"; item 3: "Once a versioned package has been released, the contents of that version MUST NOT be modified."
- Conventional Commits 1.0.0; semantic-release; release-please (Google). CalVer: Ubuntu YY.0M.
- Registries and immutability: Amazon ECR tag immutability (exceptions since 23 July 2025), Artifact Registry immutable tags, ACR locking (`--write-enabled false`), Docker Hub immutable tags (beta), GitLab immutable tags (GA 18.10), npm and PyPI never reuse a version or filename. Google Container Registry shut down in 2025.
- GitHub Actions artifacts retained 90 days by default.
- OCI image spec annotations: org.opencontainers.image.revision, .source, .version, .created.
- tj-actions/changed-files (March 2025, CVE-2025-30066): version tags re-pointed to a malicious commit; 23,000+ repositories referenced the action.
- The rebuild story, its hashes and image-lib versions are illustrative.
