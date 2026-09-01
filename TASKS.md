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
- [x] Add an automated weekly check that every WellnessLiving link on the site
      still resolves, and repair changed product ids automatically without
      needing human input. WellnessLiving serves "Systems Error: Promotion does
      not exist" with HTTP 200, so checks must read the response body.
      Done 2026-09-01:
      - Moved all catalog ids into src/data/wellnessliving-products.json with a
        typed helper at src/data/wellnessliving.ts. Pages now call
        wlCatalogUrl('introPass') instead of hardcoding URLs, so the healer only
        ever rewrites one pure-data file. Verified byte-identical output.
      - scripts/check-wellnessliving-links.mjs (`npm run check:links`): fast,
        no-dependency body-level check for humans.
      - scripts/heal-wellnessliving-links.mjs (`npm run heal:links`): drives a
        real browser because WellnessLiving's catalog API is request-signed.
        Requires two independent signals to agree before writing an id: the
        store's own ordered product feed for discovery, then the candidate's own
        product page must render the expected title AND price. Refuses and asks
        for a human on any mismatch or ambiguity.
      - .github/workflows/weekly-link-check.yml: Sundays 12:00 UTC (an hour
        after the deploy). Repairs, verifies the build, commits, pushes,
        triggers a Netlify deploy. Files/updates one `broken-link` issue for
        anything it cannot confirm, and closes it once links are healthy.
      Verified: healthy state untouched; the real 4035272 bug auto-repaired to
      4244018; refused to repoint the $56 pass at a $2,600 retreat (price
      guard); partial repair commits the fix AND still reports the failure.
      NOTE: repo is public, so GitHub auto-disables scheduled workflows after
      60 days with no repo activity. This job pushing a commit resets that
      clock whenever it actually repairs something, but a long quiet stretch
      with no breakage can still disable both this and the weekly deploy.
