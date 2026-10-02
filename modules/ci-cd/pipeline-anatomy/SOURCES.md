# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m03-facts.md` (raw pages in `cicd/m03/`).

- GitHub Docs, "Understanding GitHub Actions" and workflow syntax: workflows in `.github/workflows`, events, jobs (parallel unless `needs`), steps, actions, runners; each job on a fresh GitHub-hosted runner; job limit 6 hours (`timeout-minutes` default 360); matrix up to 256 jobs. Exit codes: non-zero fails the step.
- GitHub Docs, artifacts: retained 90 days by default. Current action majors (Oct 2026): actions/checkout v7, actions/upload-artifact v7.
- GitHub Docs, webhooks: external CI hears about pushes by HTTP POST; GitHub Actions handles events internally. About status checks: checks and commit statuses; required status checks on protected branches.
- GitLab CI/CD (`.gitlab-ci.yml`, stages, jobs, runners, `needs`), Jenkins (Jenkinsfile, Declarative Pipeline, agent/stages/steps; "Pipeline as Code"), Azure Pipelines (azure-pipelines.yml, stages/jobs/steps/tasks, agents and pools), CircleCI (`.circleci/config.yml`, workflows/jobs/steps/executors), Tekton (Task, Pipeline, TaskRun, PipelineRun; steps as containers; CNCF incubating since 13 March 2026).
- Jenkins history: Hudson, by Kohsuke Kawaguchi at Sun (started 2004, released 2005); renamed Jenkins in January 2011 after a trademark dispute with Oracle.
- Priya and her pull request are illustrative.
