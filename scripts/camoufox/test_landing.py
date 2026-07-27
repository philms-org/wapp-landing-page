"""E2E smoke test for the landing page, driven by Camoufox.

Requires the dev server running (npm run dev) at BASE_URL.

Run:
    scripts/camoufox/venv/bin/python3 scripts/camoufox/test_landing.py
"""

import os
import sys

from camoufox.sync_api import Camoufox

BASE_URL = os.environ.get("BASE_URL", "http://localhost:5173")


def run():
    with Camoufox(headless=True) as browser:
        page = browser.new_page()
        page.goto(BASE_URL)

        page.get_by_role("heading", name="The W App").wait_for()
        print("PASS: landing page loads and headline renders")


if __name__ == "__main__":
    try:
        run()
    except Exception as exc:
        print(f"FAIL: {exc}")
        sys.exit(1)
