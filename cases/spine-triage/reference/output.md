## Triage

> **Verdict:** Not ready
> **Date:** 2026-11-12
> **Story:** S-7: Reordering and wishlists

### Gaps (ranked)
| Rank | Gap | Blocks | Fix (who does what) |
|---|---|---|---|
| 1 | Acceptance criteria are not testable ("works correctly", "appropriately") | spec | Author: rewrite each as Given/When/Then with concrete values |
| 2 | No failure or misuse criterion | spec | Author: add a criterion for an unavailable product and for another customer's order |
| 3 | Two outcomes in one story | refine | Author: split into a reorder story and a wishlist story |
| 4 | No non-goals | spec | Author: add at least one non-goal per story |
| 5 | Implementation detail in AC-2 (a `wishlists` table) | spec | Author: move it to Context |

### Checklist
- [ ] 1. Single outcome: reorder and wishlist ship separately
- [ ] 2. User story complete: no outcome, role is "a user"
- [x] 3. Criteria exist: two
- [ ] 4. Criteria testable: no Given/When/Then
- [ ] 5. Failure and misuse covered: none
- [ ] 6. Non-goals present: none
- [ ] 7. No implementation: AC-2 names a table
- [ ] 8. Context sufficient: no Context section
- [x] 9. Questions bounded: none listed
- [ ] 10. Size plausible: two features

### Notes
None.
