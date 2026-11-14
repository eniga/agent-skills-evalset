# Constraints

> **Status:** Draft
> **Approved by:** pending | **Date:** 2026-11-12
> **Applies to:** new changes from 2026-11-12 (existing code: not retrofitted)

All thresholds are proposals until a person confirms them.

## Rules
| ID | Rule | Threshold | Command | Gate | Block/Warn | Reason |
|---|---|---|---|---|---|---|
| C-1 | Unit tests | all pass | `npm test` | pre-commit, CI | block | the only check that exists today |
| C-2 | No secrets committed | zero findings | `gitleaks git .` (not yet wired) | pre-commit, CI | block | a leaked token cannot be recalled |
| C-3 | Dependency audit | no high or critical | `osv-scanner scan source -r .` (not yet wired) | CI | warn | no dependencies today; guards the first one |
| C-4 | Formatting | formatter default | manual: reviewer, until a formatter is chosen (not yet wired) | editor | warn | no formatter is configured |
| C-5 | Commits cite `SL-`, `R-`, or `D-` IDs | every behavior change | `sh .githooks/commit-msg --range main..HEAD` (not yet wired) | commit-msg, CI | block | keeps changes traceable |

## Gates
- **Editor/agent (every edit):** `npm test`
- **Pre-commit:** `npm test`
- **CI (merge gate):** none yet; there is no CI workflow
- **Nightly:** none

## Exceptions
In the PR description, approved by a reviewer, expires at merge.
