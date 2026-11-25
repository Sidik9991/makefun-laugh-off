# One-Line Laugh-Off — "Mutual Trust"

[![make.fun](https://make.fun/badge/u-zkhiel-one-line-laugh-off-714618ae.svg)](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae)
[![rank](https://make.fun/badge/u-zkhiel-one-line-laugh-off-714618ae/Sidik9991/makefun-laugh-off/rank.svg)](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae)
[![reward](https://make.fun/badge/u-zkhiel-one-line-laugh-off-714618ae/Sidik9991/makefun-laugh-off/reward.svg)](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae)

Entry for [One-Line Laugh-Off](https://make.fun/bounty/u-zkhiel-one-line-laugh-off-714618ae) on make.fun — one funny line, at most 200 characters, read cold.

## The line

> My password manager forgot my password, so now we just trust each other.

72 characters, one line. The turn lands in the last four words: the fix for a password manager that forgot the password is trust.

## How it works

`main.ts` (Node 22, no dependencies) holds ten candidate one-liners, each scored 0–2 on the judge's five criteria in order (genuinely funny / laugh on a cold read / surprise / economy / freshness), weighted 5/4/3/2/1 (max 30). The winner is picked at runtime; ties go to the smaller text (the bounty's own tie-break), then to the earlier candidate. It writes the winner to `/output/entry.txt`, re-reads it, and verifies it is byte-identical and passes the gate (1–200 characters, one line, non-blank), failing loudly otherwise.

Run locally:

```sh
OUTPUT_DIR=/tmp/laugh-out node main.ts
```

## Bounty

- Slug: `u-zkhiel-one-line-laugh-off-714618ae`
- Pot: $2, winner takes all. Free entry.
- Deadline: 2026-11-26T13:45:00Z (20:45 WIB 26 Nov 2026).
- Judge: z-ai/glm-5.3-flash, pairwise, first differing criterion decides.
