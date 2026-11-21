# Review: feature/gift-message

> **Date:** 2026-11-21
> **Change:** main..feature/gift-message at head
> **Requirements:** agreed in conversation
> **Reviewer:** fresh context
> **Round:** 1
> **Load assumed:** a library used by one storefront, from `README.md`

## Verdict
**Request changes**
The gift message works as specified, but `src/page.js:9` writes the customer's text into the order page without escaping it.

## What the diff does
Adds `withGiftMessage`, which stores a length-checked message, and renders it on the order page. Matches the stated intent, but copies the page's unescaped interpolation to a value a customer types.

## Findings
| # | Severity | ID | Location | Finding | Evidence | Suggested fix | If skipped |
|---|---|---|---|---|---|---|---|
| 1 | Blocker | R-2 | `src/page.js:9` | The customer's gift message is written into HTML without escaping (stored XSS) | message `<img src=x onerror=alert(1)>` runs script on the order page | HTML-escape `giftMessage` before interpolating it | any customer can run script in the storefront for whoever opens the order page |

## Unnecessary change
- none

## Proof
- Changed behavior and failure paths tested: yes; no test with HTML in the message
- Assertions weakened or skipped: none
- Evidence covers latest commit: yes
- Still Fail or Unverified: none
