"""E2E test for the attendee/organizer signup forms, driven by Camoufox.

Requires the dev server running (npm run dev) at BASE_URL, started with fake
Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY need to be
present for the client to construct — see src/lib/supabase.ts — but do not
need to be real, since the network call is intercepted below and never
reaches the real Supabase project).

Run:
    VITE_SUPABASE_URL=https://example.supabase.co \
    VITE_SUPABASE_ANON_KEY=test-key \
    npm run dev &

    scripts/camoufox/venv/bin/python3 scripts/camoufox/test_signup.py
"""

import os
import sys

from camoufox.sync_api import Camoufox

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5173")


def mock_leads_insert(route):
    route.fulfill(status=201, content_type="application/json", body="[]")


def test_attendee(page):
    page.goto(BASE_URL)
    page.route("**/rest/v1/leads", mock_leads_insert)

    page.get_by_role("button", name="Get early access").click()
    page.get_by_text("Enter a valid email address.").wait_for()
    print("PASS: attendee form blocks an empty/invalid email")

    page.get_by_label("Email address").first.fill("attendee@example.com")
    page.get_by_role("button", name="Get early access").click()
    page.get_by_text("Thanks — we'll be in touch.").wait_for()
    print("PASS: attendee form submits and shows the thank-you message")


def test_organizer(page):
    page.goto(BASE_URL)
    page.route("**/rest/v1/leads", mock_leads_insert)

    page.get_by_label("Email address").nth(1).fill("organizer@example.com")
    page.get_by_role("button", name="Talk to us about your event").click()
    page.get_by_text("Select your role.").wait_for()
    print("PASS: organizer form requires a role")

    page.get_by_label("Your role").select_option("event_owner")
    page.get_by_role("button", name="Talk to us about your event").click()
    page.get_by_text("Thanks — we'll be in touch.").wait_for()
    print("PASS: organizer form submits and shows the thank-you message")


def run():
    with Camoufox(headless=True) as browser:
        page = browser.new_page()
        test_attendee(page)
        page = browser.new_page()
        test_organizer(page)


if __name__ == "__main__":
    try:
        run()
    except Exception as exc:
        print(f"FAIL: {exc}")
        sys.exit(1)
