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

## Phase 1 — Create your Supabase project (~15 min)

Supabase is the database that stores each signup. You told me you haven't set this up yet, so:

- [ ] 🧑 Go to [supabase.com/dashboard](https://supabase.com/dashboard), sign up or log in, and click "New project." Pick a name (e.g. "wap-landing") and a strong database password — **save that password somewhere safe, you'll need it if you ever connect directly to the database.** The free tier is enough for a waitlist page.
  **You'll know it worked when:** you land on your new project's dashboard.

- [ ] 🧑 In the left sidebar, open **SQL Editor** → **New query**. Paste in the contents of this repo's `supabase/migrations/0001_create_leads_table.sql` file and click **Run**.
  **You'll know it worked when:** you see "Success. No rows returned" and a new `leads` table appears under **Table Editor**.

- [ ] 🧑 Go to **Project Settings → API**. Copy the **Project URL** and the **anon public** key (not the `service_role` key — that one must never be used in a browser-facing app). Keep this tab open; you'll paste these into Vercel in Phase 3, not into this chat.
  **You'll know it worked when:** you have both values copied somewhere private (a password manager, not a text file you'll forget about).

---

## Phase 2 — Create your Vercel account (~5 min)

- [ ] 🧑 Go to [vercel.com/signup](https://vercel.com/signup) and sign up, ideally with the same GitHub account that owns the `philms-org/wapp-landing-page` repo — this lets Vercel deploy automatically on every push. The free **Hobby** plan is right for personal/testing use, which is what you told me this is.
  **You'll know it worked when:** you're on the Vercel dashboard.

---

## Phase 3 — Deploy the app (~15 min)

- [ ] 🤝 In the Vercel dashboard, click **Add New → Project**, and import `philms-org/wapp-landing-page` from GitHub. Vercel will auto-detect it as a Vite app — leave the build command (`npm run build`) and output directory (`dist`) as the defaults, it doesn't need a config file for this.

- [ ] 🧑 Before clicking Deploy, open **Environment Variables** in that same import screen and add two entries, pasting in the values you copied from Supabase in Phase 1:
  - `VITE_SUPABASE_URL` → your Project URL
  - `VITE_SUPABASE_ANON_KEY` → your anon public key

  **Never paste these into this chat — they go directly into Vercel's form.**

- [ ] 🧑 Click **Deploy**. Vercel will build and give you a live URL like `wapp-landing-page.vercel.app`.
  **You'll know it worked when:** that URL loads the page with the hero, sponsors trail, and both signup forms visible.

---

## Phase 4 — Connect your domain (~10 min + up to 24h wait)

You told me you already own a domain.

- [ ] 🧑 In your Vercel project, go to **Settings → Domains**, type your domain, and click **Add**. Vercel will show you either an **A record** and/or **CNAME record** (these are just instructions for your domain's "address book," called DNS, on where to send visitors) to add at your domain registrar (GoDaddy, Namecheap, Google Domains, etc.).
  **You'll know it worked when:** Vercel shows a green checkmark next to your domain — this can take anywhere from a few minutes to 24 hours after you save the DNS records, because DNS changes take time to spread across the internet ("propagation").

- [ ] 🧑 Once it's green, visit your domain in a browser and confirm the padlock/HTTPS icon shows — Vercel issues this automatically, no action needed from you beyond waiting.

---

## Phase 5 — Smoke test as a real customer (~10 min)

Do this on your **live domain**, not localhost — a working build on your machine doesn't guarantee the live environment (real env vars, real network) works too.

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
