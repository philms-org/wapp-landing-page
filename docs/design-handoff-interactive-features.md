# Design Handoff — Interactive Features on the Landing Page

Reference doc for the design team covering the two interactive, custom-built pieces of the landing page. Written from the current live implementation (not the original spec — a few details evolved during build, noted below).

Live reference: [wapp-landing-page.vercel.app](https://wapp-landing-page.vercel.app) (custom domain `the-w.app` pending DNS connection).

---

## 1. Interactive Hero — Drag-and-Drop Avatar Crowd with Description Reveal

**What it is:** the hero section is a "crowd" of 13 small stick-figure avatars (7 wearing a tie, 6 in a dress) scattered across the stage, each one gently bobbing up and down at rest so the crowd feels alive rather than static.

Below/around the crowd sit **4 circular drop zones**, one in each corner of the hero: **WHO**, **QR Connect**, **Live Feed**, **Rewards**.

**The interaction:**
1. Visitor drags any avatar with the mouse.
2. Dropping it inside a corner zone triggers three things at once:
   - The zone's circle lights up — background shifts to a soft cyan tint and a cyan glow blooms around it.
   - A **one-line value-prop caption reveals** under the zone's title, e.g. dropping on **WHO** reveals *"See who's already in the room."*
   - The avatar itself plays a **short built-in gesture animation** — its arm moves in a distinct way per zone (a quick raise for WHO, a hold-out motion for QR Connect, a double-tap gesture for Live Feed, a raised-arm flourish for Rewards) — so the drop feels acknowledged, not just snapped into place.
3. Avatars can be dragged back out or into a different zone at any time; a zone can hold multiple avatars at once (they arrange into slots inside the circle). Reloading the page resets everyone to their original scattered positions.

**Copy currently live in each zone:**
| Zone | Reveal caption |
|---|---|
| WHO | "See who's already in the room" |
| QR Connect | "Trade contacts in one tap" |
| Live Feed | "Post and see what's happening live" |
| Rewards | "Unlock perks as you engage" |

**Visual notes for design:** avatars are minimal line-art stick figures (charcoal `#1f2937` strokes, one accent shape per outfit — a small cyan necktie triangle for the "tie" figures). Drop zones are soft circles with a light warm-white fill at rest and a cyan-glow fill when active. This is a **lighter, warm off-white page theme** (not the original pure-black concept) — background is a soft stone/off-white, not black.

---

## 2. Sponsors Section — Cursor-Driven Logo Trail

**What it is:** a full-width section with the headline *"Engage sponsors like never before."* As the visitor moves their mouse across the section, small sponsor-name cards spawn right at the cursor and flash/fade behind it as it moves — like a trail of photo cards being flicked out.

**The interaction, in detail:**
- Purely mouse-move driven — no click or drag needed.
- Each card pops in fast (quick scale/opacity flash), holds briefly, then fades and shrinks away — roughly a half-second lifespan per card.
- Cards spawn at a throttled rate (~every 90ms of mouse movement) so it reads as a trail rather than a solid smear.
- Each card is given a **random tilt** (drawn from a fixed set of rotation angles, alternating positive/negative) so the trail looks like a loose stack of tossed photo cards rather than a straight line of identical logos.
- Cards currently cycle through placeholder sponsor names (Acme Co., Northwind, Globex, etc.) — real sponsor logos/marks can be swapped in without changing the interaction mechanics.

**Visual notes for design:** cards are small white rounded-rectangle badges with a subtle shadow and thin gray border, sponsor name centered in bold small-caps-weight text. This is also on the light/off-white background theme, not black.

---

## Notes on scope for design

- Both features are fully built and live — this doc describes shipped behavior, not a proposal.
- The overall page theme shifted from the original all-black/cyan concept to a **white/off-white background with cyan as the sole accent color** partway through the build — worth keeping in mind if design references the earlier spec.
- No real app screenshots or real sponsor logos are wired in yet — both sections currently use placeholder/graphic treatments by design, swappable later without touching the interaction code.
