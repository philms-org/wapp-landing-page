# Launch Checklist — The W App landing page

**What this is:** a React + Vite web page with two signup forms (attendees and event organizers) that save each signup as a row in a Supabase database. There's no login system and no payments on this page — it's a "get early access" waitlist page.

**Estimated total time:** ~1–1.5 hours of your own time (plus up to 24 hours of waiting for your domain to update).

**Legend:**
- 🧑 **You** — needs your identity, accounts, or a decision. An agent can't do this for you.
- 🤖 **Agent** — paste the given prompt into your coding agent (Claude Code) and it does this in the codebase.
- 🤝 **Together** — the agent prepares it, you click the final button or paste in a value.

---

## Phase 0 — Codebase readiness (done)

- [x] 🤖 Build, typecheck, and all 30 tests pass.
- [x] 🤖 Page `<title>` and social-share preview tags (Open Graph/Twitter) fixed — it no longer says the placeholder "wapp-scaffold".
- [x] 🤖 Database security checked: the `leads` table has Row Level Security on, and the public can only *insert* rows, never read, edit, or delete other people's signups. This is already correct — nothing to change.

Nothing is blocking you from moving on to Phase 1.

---

## Phase 1 — Create your Supabase project (done)

- [x] 🧑 Supabase project created (`bsgbdrtragiltunpvaoi.supabase.co`), `leads` table migrated, RLS policy in place (public can insert, not read).
- [x] 🧑 Project URL and anon key retrieved and added to Vercel (see Phase 3).

An earlier debugging session hit what looked like an RLS failure on insert; it turned out to be a false alarm in a diagnostic script (asking Postgres to return the inserted row via `Prefer: return=representation`, which the intentionally-read-blocked `anon` role can't satisfy). The actual insert path the site uses has always worked. Confirmed via a live UI test on 2026-07-23 and again via an automated E2E test (`scripts/camoufox/test_signup.py`) on 2026-07-26.

---

## Phase 2 — Create your Vercel account (done)

- [x] 🧑 Vercel account created, connected to the `philms-org/wapp-landing-page` GitHub repo.

---

## Phase 3 — Deploy the app (done)

- [x] 🤝 Project imported into Vercel (`wapp-landing-page`, team `philms-orgs-projects`).
- [x] 🧑 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` environment variables set.
- [x] 🧑 Deployed and live at `https://wapp-landing-page.vercel.app` — confirmed loading (HTTP 200) as of 2026-07-26.

---

## Phase 4 — Connect your domain (~10 min + up to 24h wait)

You told me you already own a domain.

- [ ] 🧑 In your Vercel project, go to **Settings → Domains**, type your domain, and click **Add**. Vercel will show you either an **A record** and/or **CNAME record** (these are just instructions for your domain's "address book," called DNS, on where to send visitors) to add at your domain registrar (GoDaddy, Namecheap, Google Domains, etc.).
  **You'll know it worked when:** Vercel shows a green checkmark next to your domain — this can take anywhere from a few minutes to 24 hours after you save the DNS records, because DNS changes take time to spread across the internet ("propagation").

- [ ] 🧑 Once it's green, visit your domain in a browser and confirm the padlock/HTTPS icon shows — Vercel issues this automatically, no action needed from you beyond waiting.

---

## Phase 5 — Smoke test as a real customer (~10 min)

Do this on your **live domain**, not localhost — a working build on your machine doesn't guarantee the live environment (real env vars, real network) works too.

The form logic itself (validation, submit, success state) is now covered by an automated test (`scripts/camoufox/test_signup.py`, see `docs/camoufox.md`) that mocks the network call — it doesn't touch the real Supabase project, so it can't replace this manual pass against production, but it does mean a code regression in the form flow would be caught before you ever get here.

- [ ] 🧑 Fill in the **attendee** form with a real email address you can check, and submit. Confirm you see the "Thanks — we'll be in touch" message.
- [ ] 🧑 In Supabase → **Table Editor → leads**, confirm a new row appeared with `track: attendee` and your email.
- [ ] 🧑 Repeat for the **organizer** form, picking a role from the dropdown, and confirm a second row appears with `track: organizer` and that role.
- [ ] 🧑 Open the live URL on your phone and confirm the layout looks right and both forms work there too.

**You'll know the launch is real when:** both test rows are visible in Supabase and the page looks right on mobile.

---

## Phase 6 — After launch (optional, do anytime)

These aren't blockers — the page works and collects leads without them. Consider them once real traffic starts:

- [ ] 🧑 **Privacy policy** — you're collecting email addresses. Whether you need a formal privacy policy page depends on your audience and where they're located (e.g. the EU's GDPR has specific rules). This is a legal/business call, not something I can decide for you — worth a few minutes with a template (many free ones exist) or a quick check with a lawyer if this grows into a real product.
- [ ] 🧑 **Analytics** — to see how many visitors convert into signups, consider a privacy-friendly tool like Vercel Analytics (one click to enable in your project) or Plausible.
- [ ] 🧑 **Where to check signups going forward:** Supabase dashboard → your project → **Table Editor → leads**. No extra tooling needed for a waitlist at this stage.
- [ ] 🧑 **If something breaks:** check Vercel's **Deployments** tab for build errors, and your browser's console (F12) on the live site for runtime errors first.
