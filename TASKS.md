# Tasks

Queue of work for Claude. Add new tasks to the bottom. Do not remove or edit an
unchecked task unless you are starting it.

## Rules
- Work on only one task at a time.
- New tasks go at the bottom of the list.
- Do not abandon or interrupt the current task unless the user explicitly says "interrupt".
- Finish, test, and verify the current task before starting the next.
- Before starting another task, re-read this file and select the oldest pending (unchecked) task.
- After completing a task, check it off, briefly tell the user it's done, and state which task is starting next.
- Do not combine unrelated tasks into one implementation.
- When you check a task off, indent a short `Done YYYY-MM-DD:` note under it saying what
  actually changed. If the task cannot be finished, leave it unchecked and add a
  `Blocked YYYY-MM-DD:` note explaining what is needed to unblock it.

## Queue
- [x] Fix "Intro Pass" purchase link erroring out (reported by Jax, 2026-09-01):
      front page red button -> /start -> "Get Your Intro Pass" returned a
      WellnessLiving error.
      Done 2026-09-01: WellnessLiving retired promotion `k_id=4035272`
      ("Systems Error: Promotion does not exist"). The intro special is now
      `k_id=4244018`. Updated all 5 links in src/pages/start.astro (4) and
      src/pages/pricing.astro (1). Audited every other WellnessLiving link on
      the site (4 catalog, 4 event) — all still resolve.
- [x] Fix Intro Pass buddy-pass count on the site: copy says 2 Buddy Passes /
      "Invite 2 friends free", but WellnessLiving grants 3 guest passes every
      3 weeks.
      Done 2026-09-01: verified counts against WellnessLiving for all 5 linked
      products. Two were understated, both in src/pages/pricing.astro:
      Intro Pass 2 -> 3 (line 217) and "Invite 2 friends free" -> 3 (line 221);
      Community Unlimited "1 Buddy Pass per month" -> 3 (line 23). Movement Mini,
      5 Class Pack and General Admission grant no guest passes and the site
      claims none. start.astro does not mention buddy passes at all.
- [x] Add a monthly automated check that every WellnessLiving link on the site
      still resolves. WellnessLiving serves "Systems Error: Promotion does not
      exist" with HTTP 200, so the check must grep the response body, not just
      the status code.
      Done 2026-09-01: added scripts/check-wellnessliving-links.mjs (no deps,
      Node stdlib only) plus `npm run check:links`, and
      .github/workflows/monthly-link-check.yml running it on the 1st at 12:00
      UTC. The script scrapes every WellnessLiving URL out of src/, fetches
      each, and fails on error signatures in the body ("Systems Error",
      "... does not exist", the 10s meta-refresh bounce to catalog-list). It
      reports which source file holds each dead link. Exit 1 = dead link,
      exit 2 = unreachable after 3 tries (transient). Regression-tested by
      reintroducing k_id=4035272: correctly failed and named start.astro.
