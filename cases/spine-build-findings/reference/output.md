| # | Severity | Finding | Answer | Evidence or fix |
|---|---|---|---|---|
| 1 | Blocker | Support staff get FORBIDDEN | Fix | SL-2: `getOrder` uses `canViewOrder` (`src/auth.js:2`) |
| 2 | Major | Unknown id returns null | Contest | R-2 requires `null` for an unknown id; product accepted that ids are not secret. |
| 3 | Nit | Rename `order` to `found` | Decline | Preference; `order` matches the rest of `src/orders.js`. |

SL-2 is committed. Checkpoint: `node --test` -> all pass.
