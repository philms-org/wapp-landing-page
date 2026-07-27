# Camoufox

Stealth Firefox automation ([daijro/camoufox](https://github.com/daijro/camoufox)), wired in under `scripts/camoufox/` for local E2E or scraping use. Playwright-compatible API.

## Setup (already done once, re-run if venv is missing)

```bash
python3 -m venv scripts/camoufox/venv
scripts/camoufox/venv/bin/pip install -r scripts/camoufox/requirements.txt
scripts/camoufox/venv/bin/python3 -m camoufox fetch
```

## Run the example

```bash
scripts/camoufox/venv/bin/python3 scripts/camoufox/example.py
```

## Run the landing page E2E smoke test

Requires `npm run dev` running first.

```bash
scripts/camoufox/venv/bin/python3 scripts/camoufox/test_landing.py
```

Checks the landing page loads and the "The W App" headline renders.

## Run the signup forms E2E test

Requires `npm run dev` running with fake Supabase env vars set (the client needs them to construct, but the insert call is network-mocked so it never touches the real Supabase project or writes real data):

```bash
VITE_SUPABASE_URL=https://example.supabase.co VITE_SUPABASE_ANON_KEY=test-key npm run dev &
scripts/camoufox/venv/bin/python3 scripts/camoufox/test_signup.py
```

Checks both the attendee and organizer forms: empty/invalid-email validation, missing-role validation, and a successful submit showing the "Thanks — we'll be in touch." message.

The venv is gitignored; the browser binary itself is cached at `~/Library/Caches/camoufox/` and shared across projects.
