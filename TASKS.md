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
      Proven in CI 2026-09-01 (runs 33555748029, 33556518879): read 39 live
      products, verified all against their own product pages, then repaired a
      deliberately stale Family Membership id (4035272 -> 3463743), committed as
      github-actions[bot], pushed to master and triggered a Netlify deploy.
      Family Membership stays in the products file: it is a real store product
      no page links to yet, and it is now monitored and ready to link.
      Also bumped actions/checkout and actions/setup-node to v5 to clear the
      Node 20 deprecation warning.
- [x] Add FitVID access to the site, replacing the Virtual Studio (Arketa) embeds.
      FitVID catalog: https://www.wellnessliving.com/Wl/Video/Catalog/Catalog.html?k_business=288067&k_video_category=I5kfh5Sa
      Embed if possible; otherwise link out.
      Done 2026-09-03: embedding is not possible, so this links out.
      - Embed research: every response from wellnessliving.com sends
        `X-Frame-Options: DENY` (verified against the FitVID URL itself, the
        /rs/ catalog and schedule routes), so no browser will render it in an
        iframe on our site. WellnessLiving's widget system — the
        skin-widget-static.js embeds already used on /schedule and the homepage
        signup — has no video widget: Schedule, Custom Schedule, FitBUILDER,
        Appointment, Event, Book-a-Spot, Lead Capture, Review, Store and Staff
        are the only types. The catalog also requires a client sign-in.
      - Rewrote src/pages/virtual-studio.astro: removed both Arketa iframes
        (the on-demand video library and the live virtual schedule, per the
        user's call) and replaced them with a FitVID intro, a link-out button
        and three benefit cards. Page keeps the "Virtual Studio" name and URL.
      - Added wlFitVidUrl() to src/data/wellnessliving.ts so the catalog URL
        lives with the other WellnessLiving links. It is NOT covered by
        `npm run check:links`: that checker only scans /rs/ URLs, and this one
        redirects to the login page, which its body check would read as a
        failure. If the video category is recreated, k_video_category changes
        there by hand.
      - Fixed a pre-existing broken link found on the way: the homepage
        "Explore Virtual Classes" button pointed at /virtual, which has never
        existed and had no redirect. Now /virtual-studio.
      - Dropped https://app.arketa.co from the CSP in netlify.toml; nothing
        references Arketa any more.
      Verified: build clean (21 pages), zero iframes and zero Arketa references
      in dist/, FitVID href in the built page matches the given URL, and
      `npm run check:links` still passes all 10 links. Also confirmed a
      signed-out visitor is returned to the video library after logging in —
      WellnessLiving preserves url_return back to the catalog.
