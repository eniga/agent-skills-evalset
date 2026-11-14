# AD-1: Persist orders in an append-only JSON-lines file

> **Date:** 2026-11-12
> **Status:** Proposed
> **Deciders:** to be named by the team
> **Scope:** this service

## Problem
Orders must survive a restart. Today every order is lost when the process stops.

## Forces
- **Load:** under 1,000 orders a day, single instance
- **Team:** has not run a database before
- **Assumed:** orders are never edited after creation; one writer process

## Decision criteria
| # | Criterion | How it is judged | Weight |
|---|---|---|---|
| 1 | Orders survive a restart | restart test | High |
| 2 | Size of change and fit with the current code | files touched, contract of `createOrder` unchanged | High |
| 3 | Operating burden | what must be installed, backed up, and watched | Medium |
| 4 | Data safety | who can read the stored orders | Medium |

## Options
### A: Append-only JSON-lines file
One line per order, replayed at start. Strongest argument: no new service and no new dependency.
### B: Embedded SQLite
A real query engine in one file. Strongest argument: lookups and reports stay simple as data grows.
### C: Keep the current in-memory Map (do nothing)
Strongest argument: zero work, and acceptable if orders are also held by the storefront.

## Evaluation
| Criterion | A | B | C |
|---|---|---|---|
| 1 | survives (assumed: fsync per write is fast enough at this load) | survives | fails |
| 2 | one module, contract unchanged | new dependency, schema, migrations | no change |
| 3 | back up one file | back up one file, learn SQL tooling | none |
| 4 | file permissions only | file permissions only | nothing stored |

## Decision
**Option A**, because it meets criterion 1 with the smallest change and no new dependency.
**What we give up:** queries beyond "load everything", safe concurrent writers, and easy schema changes. Option B is better at all three.

## Consequences
- **Operations:** the file must be backed up and its growth watched
- **Team:** a replay-on-start routine to maintain
- **Failure modes and attack surface:** a torn last line after a crash; customer data now sits on disk and needs restricted permissions
- **Rules out:** running a second instance

## Reversal
- **Wrong if we observe:** start-up replay over 2 seconds, or a need for a second instance
- **Cost to reverse:** low, because storage sits behind `createOrder`
- **Lowering it now:** keep all file access in one module

## Open questions
| # | Question | Owner | Blocks the spec? |
|---|---|---|---|
| 1 | Does the storefront also store orders? | product | Yes |
