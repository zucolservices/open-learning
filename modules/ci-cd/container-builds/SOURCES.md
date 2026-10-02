# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m09-facts.md` (raw pages in `cicd/m09/`).

- Docker Docs, "Docker build cache": "Once a layer changes, then all downstream layers need to be rebuilt as well"; ordering advice (copy dependency manifests and install before copying source). Only RUN, COPY and ADD add filesystem layers.
- Docker Docs, multi-stage builds: "selectively copy artifacts from one stage to another, leaving behind everything you don't want in the final image"; `COPY --from`.
- Base images (Docker Hub and registries, read 3 Oct 2026; compressed amd64 ≈ node:24 410 MB, node:24-slim 81 MB, node:24-alpine 62 MB, distroless nodejs24-debian13 55 MB). On-disk sizes in the simulation are approximate.
- BuildKit default builder since Docker Engine 23.0 (1 Feb 2023); cache and secret mounts; registry and `gha` cache backends.
- Docker Docs, pull by digest ("immutable identifier"); digest = hash of the manifest; `latest` is only the default tag.
- Kaniko archived 3 June 2025; Cloud Native Buildpacks CNCF graduated (Aug 2026); Docker Hardened Images free under Apache 2.0 since 17 Dec 2025; distroless `:nonroot`.
- Scanners: Trivy, Grype, Docker Scout; ECR enhanced scanning (Amazon Inspector), Google Artifact Analysis, Microsoft Defender for Containers.
- The service, timings and sizes in the simulation are illustrative.
