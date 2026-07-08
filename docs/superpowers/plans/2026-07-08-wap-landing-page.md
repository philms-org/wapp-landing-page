# WAP Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the WAP marketing landing page — an interactive drag-and-drop hero, a sponsor-logo cursor trail, and two lead-capture tracks (attendees / organizers) — as a standalone Vite/React app.

**Architecture:** Single-page React app (client-side routed for future extension) rendering one `LandingPage` composed of independent, focused components: a hero with draggable SVG stick figures and GSAP-driven drop-zone interactions, a mouse-driven sponsor logo trail, and two lead forms that validate client-side and insert into a dedicated Supabase project.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS v4, GSAP (core + Draggable), react-router-dom, @supabase/supabase-js, shadcn/ui (Button, Input), Vitest + React Testing Library.

## Global Constraints

- Lives in its own standalone repo at `/Users/sr/wapp` — separate from the `wingme-copy` iOS app repo.
- Stack: Vite + React + TypeScript, Tailwind CSS + shadcn/ui where useful, GSAP for animation.
- Data goes to a **new, standalone Supabase project** — never the WAP app's production Supabase project.
- Visual language: pure black background, cyan/teal accent (Tailwind `cyan-400`/`cyan-500`), bold white type, the geometric two-dot "W" mark as the recurring brand motif.
- No real app screenshots exist yet — use icon/graphic/interactive treatments only.
- `leads` table columns: `id, email, track (attendee|organizer), role (event_owner|location_owner|organizer|other, nullable), source, created_at`.
- Out of scope (do not build): the webview/demo app itself, real app screenshots, wiring to the app's production Supabase project, payment/billing, CMS or multi-page content management.
- **Build order:** the hero (Tasks 2–4) must be working and manually verified before continuing to Task 5 onward — the user wants to see and test the interactive hero before the rest of the page is built.

---

### Task 1: Project Scaffold & Base Theme

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/setupTests.ts`, `.gitignore`, `README.md`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `App` component (default export from `src/App.tsx`) rendered by `main.tsx`. Later tasks replace `App`'s contents but keep this export.

- [ ] **Step 1: Scaffold Vite in a temp dir, then merge into the repo**

```bash
npm create vite@latest /tmp/wapp-scaffold -- --template react-ts
cp -R /tmp/wapp-scaffold/. /Users/sr/wapp/
rm -rf /tmp/wapp-scaffold
cd /Users/sr/wapp
rm -f src/App.css src/assets/react.svg public/vite.svg
rmdir src/assets 2>/dev/null || true
```

- [ ] **Step 2: Install dependencies**

```bash
npm install gsap react-router-dom @supabase/supabase-js
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: Configure Tailwind v4 and Vitest in `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
```

- [ ] **Step 4: Add base styles**

`src/index.css`:
```css
@import "tailwindcss";

:root {
  color-scheme: dark;
}

body {
  background-color: #000000;
  color: #ffffff;
  margin: 0;
}
```

- [ ] **Step 5: Add test setup file**

`src/setupTests.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 6: Replace `src/App.tsx` with a placeholder**

```tsx
export function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <p className="text-xl font-bold">The W App</p>
    </div>
  );
}
```

- [ ] **Step 7: Update `src/main.tsx` to use the named export**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 8: Write the smoke test**

`src/App.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  it("renders the placeholder", () => {
    render(<App />);
    expect(screen.getByText("The W App")).toBeInTheDocument();
  });
});
```

- [ ] **Step 9: Add `.env.local` to `.gitignore`**

Append to `.gitignore`:
```
.env.local
```

- [ ] **Step 10: Add test script and run tests**

Add to `package.json` `scripts`:
```json
"test": "vitest run"
```

Run: `npm test`
Expected: `1 passed`

- [ ] **Step 11: Manually verify the dev server**

Run: `npm run dev`, open the printed localhost URL in a browser.
Expected: a black page with "The W App" centered in white text.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite/React/TS project with Tailwind and Vitest"
```

---

### Task 2: Stick Figures & Drop Zones — Static Layout

**Files:**
- Create: `src/components/hero/stickFigureData.ts`, `src/components/hero/zoneData.ts`, `src/components/hero/StickFigure.tsx`, `src/components/hero/DropZone.tsx`, `src/components/hero/Hero.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/hero/stickFigureData.test.ts`, `src/components/hero/Hero.test.tsx`

**Interfaces:**
- Produces: `Attire` type, `StickFigureDef` interface, `STICK_FIGURES: StickFigureDef[]` (from `stickFigureData.ts`); `ZoneId` type, `ZoneDef` interface, `ZONES: ZoneDef[]` (from `zoneData.ts`); `StickFigure` component (props: `{ attire: Attire }`, forwards ref to the root `<svg>`); `DropZone` component (props: `{ zone: ZoneDef; isActive: boolean; valuePropVisible: boolean }`); `Hero` component (no props).

- [ ] **Step 1: Write the stick figure data test**

`src/components/hero/stickFigureData.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { STICK_FIGURES } from "./stickFigureData";

describe("STICK_FIGURES", () => {
  it("has 13 figures: 7 tie, 6 dress", () => {
    expect(STICK_FIGURES).toHaveLength(13);
    expect(STICK_FIGURES.filter((f) => f.attire === "tie")).toHaveLength(7);
    expect(STICK_FIGURES.filter((f) => f.attire === "dress")).toHaveLength(6);
  });

  it("gives every figure a unique id", () => {
    const ids = new Set(STICK_FIGURES.map((f) => f.id));
    expect(ids.size).toBe(13);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- stickFigureData`
Expected: FAIL — `stickFigureData` module not found

- [ ] **Step 3: Implement the stick figure data**

`src/components/hero/stickFigureData.ts`:
```ts
export type Attire = "tie" | "dress";

export interface StickFigureDef {
  id: string;
  attire: Attire;
  startXPercent: number;
  startYPercent: number;
}

const TIE_COUNT = 7;
const DRESS_COUNT = 6;
const TOTAL = TIE_COUNT + DRESS_COUNT;
const COLUMNS = 7;

function scatterPosition(index: number): { startXPercent: number; startYPercent: number } {
  const row = Math.floor(index / COLUMNS);
  const col = index % COLUMNS;
  const jitterX = ((index * 37) % 10) - 5;
  const jitterY = ((index * 53) % 10) - 5;
  return {
    startXPercent: 6 + col * 13 + jitterX,
    startYPercent: 8 + row * 24 + jitterY,
  };
}

export const STICK_FIGURES: StickFigureDef[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: `figure-${i}`,
  attire: i < TIE_COUNT ? "tie" : "dress",
  ...scatterPosition(i),
}));
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- stickFigureData`
Expected: PASS

- [ ] **Step 5: Add zone data (no test needed — trivial static data used directly by Step 6's test)**

`src/components/hero/zoneData.ts`:
```ts
export type ZoneId = "who" | "qr-connect" | "live-feed" | "rewards";

export interface ZoneDef {
  id: ZoneId;
  title: string;
  valueProp: string;
}

export const ZONES: ZoneDef[] = [
  { id: "who", title: "WHO", valueProp: "See who's already in the room" },
  { id: "qr-connect", title: "QR Connect", valueProp: "Trade contacts in one tap" },
  { id: "live-feed", title: "Live Feed", valueProp: "Post and see what's happening live" },
  { id: "rewards", title: "Rewards", valueProp: "Unlock perks as you engage" },
];
```

- [ ] **Step 6: Write the Hero render test**

`src/components/hero/Hero.test.tsx`:
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import { STICK_FIGURES } from "./stickFigureData";
import { ZONES } from "./zoneData";

describe("Hero", () => {
  it("renders all 13 stick figures and all 4 zone titles", () => {
    render(<Hero />);
    expect(document.querySelectorAll("[data-figure-id]")).toHaveLength(STICK_FIGURES.length);
    ZONES.forEach((zone) => {
      expect(screen.getByText(zone.title)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npm test -- Hero`
Expected: FAIL — `Hero` module not found

- [ ] **Step 8: Implement `StickFigure`**

`src/components/hero/StickFigure.tsx`:
```tsx
import type { Attire } from "./stickFigureData";

interface StickFigureProps {
  attire: Attire;
}

export function StickFigure({ attire }: StickFigureProps) {
  return (
    <svg viewBox="0 0 40 80" width={40} height={80} className="overflow-visible">
      <circle cx="20" cy="10" r="8" fill="none" stroke="white" strokeWidth="2" />
      <line x1="20" y1="18" x2="20" y2="50" stroke="white" strokeWidth="2" />
      <line data-part="left-arm" x1="20" y1="25" x2="8" y2="40" stroke="white" strokeWidth="2" />
      <line data-part="right-arm" x1="20" y1="25" x2="32" y2="40" stroke="white" strokeWidth="2" />
      {attire === "tie" ? (
        <>
          <line x1="10" y1="50" x2="20" y2="75" stroke="white" strokeWidth="2" />
          <line x1="30" y1="50" x2="20" y2="75" stroke="white" strokeWidth="2" />
          <polygon points="17,20 23,20 20,32" fill="#22d3ee" />
        </>
      ) : (
        <polygon points="10,50 30,50 24,75 16,75" fill="none" stroke="white" strokeWidth="2" />
      )}
    </svg>
  );
}
```

- [ ] **Step 9: Implement `DropZone`**

`src/components/hero/DropZone.tsx`:
```tsx
import type { ZoneDef } from "./zoneData";

interface DropZoneProps {
  zone: ZoneDef;
  isActive: boolean;
  valuePropVisible: boolean;
}

export function DropZone({ zone, isActive, valuePropVisible }: DropZoneProps) {
  return (
    <div
      data-zone-id={zone.id}
      className={`flex min-h-[160px] flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
        isActive ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]" : "border-white/20"
      }`}
    >
      <h3 className="font-bold uppercase tracking-wide text-white">{zone.title}</h3>
      {valuePropVisible && <p className="text-center text-sm text-cyan-400">{zone.valueProp}</p>}
    </div>
  );
}
```

- [ ] **Step 10: Implement `Hero` (static — no drag yet)**

`src/components/hero/Hero.tsx`:
```tsx
import { STICK_FIGURES } from "./stickFigureData";
import { ZONES } from "./zoneData";
import { StickFigure } from "./StickFigure";
import { DropZone } from "./DropZone";

export function Hero() {
  return (
    <section className="relative px-6 py-12">
      <div className="relative h-64 w-full">
        {STICK_FIGURES.map((figure) => (
          <div
            key={figure.id}
            data-figure-id={figure.id}
            className="absolute"
            style={{ left: `${figure.startXPercent}%`, top: `${figure.startYPercent}%` }}
          >
            <StickFigure attire={figure.attire} />
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        {ZONES.map((zone) => (
          <DropZone key={zone.id} zone={zone} isActive={false} valuePropVisible={false} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 11: Wire `Hero` into `App`**

`src/App.tsx`:
```tsx
import { Hero } from "./components/hero/Hero";

export function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
    </div>
  );
}
```

Update `src/App.test.tsx` to match (the old "The W App" text is gone):
```tsx
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
  });
});
```

- [ ] **Step 12: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS

- [ ] **Step 13: Manually verify in browser**

Run: `npm run dev`
Expected: 13 stick figures scattered in the top area, 4 zone boxes ("WHO", "QR Connect", "Live Feed", "Rewards") below them, no interaction yet.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: static stick figure crowd and drop zone layout"
```

---

### Task 3: Drag-and-Drop Behavior

**Files:**
- Create: `src/lib/gsap.ts`, `src/components/hero/dropLogic.ts`
- Modify: `src/components/hero/Hero.tsx`
- Test: `src/components/hero/dropLogic.test.ts`

**Interfaces:**
- Consumes: `STICK_FIGURES`, `StickFigureDef` (Task 2); `ZONES`, `ZoneDef`, `ZoneId` (Task 2)
- Produces: `gsap`, `Draggable` (re-exported from `src/lib/gsap.ts`); `Rect` interface, `rectsOverlap(a: Rect, b: Rect): boolean`, `findDropZone(figureRect: Rect, zoneRects: Record<ZoneId, Rect>): ZoneId | null`, `slotPosition(zoneRect: Rect, slotIndex: number): { x: number; y: number }` (from `dropLogic.ts`) — later tasks (4) rely on `Hero`'s internal assignment state shape `Record<string, ZoneId | null>`.

- [ ] **Step 1: Write the drop logic tests**

`src/components/hero/dropLogic.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { findDropZone, rectsOverlap, slotPosition, type Rect } from "./dropLogic";

const rect = (left: number, top: number, width: number, height: number): Rect => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
  width,
  height,
});

describe("rectsOverlap", () => {
  it("returns true when rects intersect", () => {
    expect(rectsOverlap(rect(0, 0, 10, 10), rect(5, 5, 10, 10))).toBe(true);
  });

  it("returns false when rects don't intersect", () => {
    expect(rectsOverlap(rect(0, 0, 10, 10), rect(20, 20, 10, 10))).toBe(false);
  });
});

describe("findDropZone", () => {
  it("returns the id of the overlapping zone", () => {
    const zoneRects = {
      who: rect(0, 0, 100, 100),
      "qr-connect": rect(200, 0, 100, 100),
      "live-feed": rect(400, 0, 100, 100),
      rewards: rect(600, 0, 100, 100),
    };
    expect(findDropZone(rect(210, 10, 20, 20), zoneRects)).toBe("qr-connect");
  });

  it("returns null when no zone overlaps", () => {
    const zoneRects = {
      who: rect(0, 0, 100, 100),
      "qr-connect": rect(200, 0, 100, 100),
      "live-feed": rect(400, 0, 100, 100),
      rewards: rect(600, 0, 100, 100),
    };
    expect(findDropZone(rect(1000, 1000, 20, 20), zoneRects)).toBeNull();
  });
});

describe("slotPosition", () => {
  it("centers slot 1 on the zone and offsets others", () => {
    const zoneRect = rect(0, 0, 100, 200);
    expect(slotPosition(zoneRect, 1)).toEqual({ x: 50, y: 40 });
    expect(slotPosition(zoneRect, 0).x).toBeLessThan(50);
    expect(slotPosition(zoneRect, 2).x).toBeGreaterThan(50);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- dropLogic`
Expected: FAIL — `dropLogic` module not found

- [ ] **Step 3: Implement `dropLogic.ts`**

```ts
import type { ZoneId } from "./zoneData";

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

export function findDropZone(
  figureRect: Rect,
  zoneRects: Record<ZoneId, Rect>
): ZoneId | null {
  const entries = Object.entries(zoneRects) as [ZoneId, Rect][];
  for (const [zoneId, rect] of entries) {
    if (rectsOverlap(figureRect, rect)) {
      return zoneId;
    }
  }
  return null;
}

export function slotPosition(zoneRect: Rect, slotIndex: number): { x: number; y: number } {
  const spacing = 28;
  return {
    x: zoneRect.left + zoneRect.width / 2 + (slotIndex - 1) * spacing,
    y: zoneRect.top + 40,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- dropLogic`
Expected: PASS

- [ ] **Step 5: Create the GSAP module**

`src/lib/gsap.ts`:
```ts
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export { gsap, Draggable };
```

- [ ] **Step 6: Wire dragging into `Hero`**

Replace `src/components/hero/Hero.tsx` with:
```tsx
import { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "../../lib/gsap";
import { STICK_FIGURES } from "./stickFigureData";
import { ZONES, type ZoneId } from "./zoneData";
import { StickFigure } from "./StickFigure";
import { DropZone } from "./DropZone";
import { findDropZone, slotPosition, type Rect } from "./dropLogic";

function toRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
}

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const zoneRefs = useRef<Record<ZoneId, HTMLDivElement | null>>(
    {} as Record<ZoneId, HTMLDivElement | null>
  );
  const [assignments, setAssignments] = useState<Record<string, ZoneId | null>>(() =>
    Object.fromEntries(STICK_FIGURES.map((f) => [f.id, null]))
  );
  const [occupants, setOccupants] = useState<Record<ZoneId, string[]>>(
    () => Object.fromEntries(ZONES.map((z) => [z.id, []])) as Record<ZoneId, string[]>
  );

  useEffect(() => {
    const draggables = STICK_FIGURES.map((figure) => {
      const el = figureRefs.current[figure.id];
      if (!el || !stageRef.current) return null;

      const [instance] = Draggable.create(el, {
        bounds: stageRef.current,
        onDragEnd() {
          const currentX = Number(gsap.getProperty(el, "x"));
          const currentY = Number(gsap.getProperty(el, "y"));
          const figureRect = toRect(el);
          const originLeft = figureRect.left - currentX;
          const originTop = figureRect.top - currentY;

          const zoneRects = Object.fromEntries(
            ZONES.map((z) => [z.id, toRect(zoneRefs.current[z.id]!)])
          ) as Record<ZoneId, Rect>;

          const hitZone = findDropZone(figureRect, zoneRects);

          setOccupants((prevOccupants) => {
            const cleared: Record<ZoneId, string[]> = Object.fromEntries(
              ZONES.map((z) => [z.id, prevOccupants[z.id].filter((id) => id !== figure.id)])
            ) as Record<ZoneId, string[]>;

            if (hitZone) {
              cleared[hitZone] = [...cleared[hitZone], figure.id];
              const slotIndex = cleared[hitZone].length - 1;
              const target = slotPosition(zoneRects[hitZone], slotIndex);
              gsap.to(el, {
                x: target.x - originLeft,
                y: target.y - originTop,
                duration: 0.4,
                ease: "power2.out",
              });
            } else {
              gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
            }

            return cleared;
          });

          setAssignments((prev) => ({ ...prev, [figure.id]: hitZone }));
        },
      });
      return instance;
    });

    return () => {
      draggables.forEach((d) => d?.kill());
    };
  }, []);

  return (
    <section className="relative px-6 py-12">
      <div ref={stageRef} className="relative h-64 w-full">
        {STICK_FIGURES.map((figure) => (
          <div
            key={figure.id}
            data-figure-id={figure.id}
            ref={(el) => {
              figureRefs.current[figure.id] = el;
            }}
            className="absolute cursor-grab active:cursor-grabbing"
            style={{ left: `${figure.startXPercent}%`, top: `${figure.startYPercent}%` }}
          >
            <StickFigure attire={figure.attire} />
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        {ZONES.map((zone) => (
          <div
            key={zone.id}
            ref={(el) => {
              zoneRefs.current[zone.id] = el;
            }}
          >
            <DropZone
              zone={zone}
              isActive={occupants[zone.id].length > 0}
              valuePropVisible={occupants[zone.id].length > 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Run existing tests to verify nothing broke**

Run: `npm test`
Expected: all PASS (the Task 2 `Hero.test.tsx` render assertions still hold — refs don't change what's rendered)

- [ ] **Step 8: Manually verify dragging in the browser**

Run: `npm run dev`. Drag a stick figure onto each of the 4 zones.
Expected: the zone border turns cyan and glows, its value-prop text appears, and the figure settles into that zone. Drag a figure to empty space outside any zone — it should snap back to its original scatter position.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: draggable stick figures with drop-zone hit testing"
```

---

### Task 4: Idle Animation, Zone Gestures & Value-Prop Reveal

**Files:**
- Modify: `src/components/hero/Hero.tsx`

**Interfaces:**
- Consumes: `assignments` state shape from Task 3 (`Record<string, ZoneId | null>`)
- Produces: no new exports — this task adds animation behavior on top of Task 3's `Hero`.

- [ ] **Step 1: Add idle bob animation on mount**

In `src/components/hero/Hero.tsx`, add a second `useEffect` (after the drag-setup effect) that runs once on mount:

```tsx
useEffect(() => {
  STICK_FIGURES.forEach((figure, i) => {
    const el = figureRefs.current[figure.id];
    if (!el) return;
    gsap.to(el, {
      y: "+=6",
      duration: 1.4 + (i % 3) * 0.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
}, []);
```

- [ ] **Step 2: Add per-zone gesture animation on assignment change**

Add a `playGesture` helper and a `useEffect` keyed on `assignments`:

```tsx
function playGesture(el: HTMLElement, zoneId: ZoneId) {
  const rightArm = el.querySelector<SVGLineElement>('[data-part="right-arm"]');
  if (!rightArm) return;

  switch (zoneId) {
    case "who":
      gsap.to(rightArm, { attr: { y2: 15 }, duration: 0.3, ease: "back.out(2)" });
      break;
    case "qr-connect":
      gsap.to(rightArm, { attr: { x2: 20, y2: 20 }, duration: 0.3, ease: "power2.out" });
      break;
    case "live-feed":
      gsap.fromTo(
        rightArm,
        { attr: { x2: 32, y2: 40 } },
        { attr: { x2: 30, y2: 30 }, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.inOut" }
      );
      break;
    case "rewards":
      gsap.to(rightArm, { attr: { x2: 15, y2: 12 }, duration: 0.3, ease: "back.out(2)" });
      break;
  }
}
```

Add the effect inside `Hero`, after the idle-bob effect:

```tsx
const previousAssignments = useRef<Record<string, ZoneId | null>>({});

useEffect(() => {
  STICK_FIGURES.forEach((figure) => {
    const zoneId = assignments[figure.id];
    const prevZoneId = previousAssignments.current[figure.id];
    if (zoneId && zoneId !== prevZoneId) {
      const el = figureRefs.current[figure.id];
      if (el) playGesture(el, zoneId);
    }
  });
  previousAssignments.current = assignments;
}, [assignments]);
```

- [ ] **Step 3: Run tests to verify nothing broke**

Run: `npm test`
Expected: all PASS

- [ ] **Step 4: Manually verify in browser**

Run: `npm run dev`. Confirm: figures gently bob up and down at rest. Drag one figure into each of the 4 zones one at a time and confirm each plays a distinct arm gesture on drop.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: idle bob animation and per-zone gesture on drop"
```

- [ ] **CHECKPOINT — STOP HERE.** The hero is now feature-complete per the spec. Report back and get explicit user confirmation before proceeding to Task 5. Do not continue automatically.

---

### Task 5: Sponsors Section — Cursor Logo Trail

**Files:**
- Create: `src/components/sponsors/sponsorLogos.ts`, `src/components/sponsors/SponsorsSection.tsx`, `src/components/sponsors/useLogoTrail.ts`
- Modify: `src/App.tsx`
- Test: `src/components/sponsors/sponsorLogos.test.ts`

**Interfaces:**
- Produces: `SponsorLogo` interface, `SPONSOR_LOGOS: SponsorLogo[]`, `pickLogo(index: number): SponsorLogo` (from `sponsorLogos.ts`); `useLogoTrail(containerRef: RefObject<HTMLDivElement>): (event: React.MouseEvent<HTMLDivElement>) => void`; `SponsorsSection` component (no props).

- [ ] **Step 1: Write the logo-cycling test**

`src/components/sponsors/sponsorLogos.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { pickLogo, SPONSOR_LOGOS } from "./sponsorLogos";

describe("pickLogo", () => {
  it("cycles through the logo list", () => {
    expect(pickLogo(0)).toBe(SPONSOR_LOGOS[0]);
    expect(pickLogo(SPONSOR_LOGOS.length)).toBe(SPONSOR_LOGOS[0]);
    expect(pickLogo(SPONSOR_LOGOS.length + 2)).toBe(SPONSOR_LOGOS[2]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- sponsorLogos`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `sponsorLogos.ts`**

```ts
export interface SponsorLogo {
  id: string;
  label: string;
}

export const SPONSOR_LOGOS: SponsorLogo[] = [
  { id: "sponsor-1", label: "Acme Co." },
  { id: "sponsor-2", label: "Northwind" },
  { id: "sponsor-3", label: "Globex" },
  { id: "sponsor-4", label: "Initech" },
  { id: "sponsor-5", label: "Umbrella" },
  { id: "sponsor-6", label: "Stark Industries" },
  { id: "sponsor-7", label: "Wayne Enterprises" },
  { id: "sponsor-8", label: "Hooli" },
];

export function pickLogo(index: number): SponsorLogo {
  return SPONSOR_LOGOS[index % SPONSOR_LOGOS.length];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- sponsorLogos`
Expected: PASS

- [ ] **Step 5: Implement the trail hook**

`src/components/sponsors/useLogoTrail.ts`:
```ts
import { useCallback, useRef, type RefObject } from "react";
import { gsap } from "../../lib/gsap";
import { pickLogo } from "./sponsorLogos";

export function useLogoTrail(containerRef: RefObject<HTMLDivElement>) {
  const lastSpawnRef = useRef(0);
  const indexRef = useRef(0);

  return useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < 90) return;
      lastSpawnRef.current = now;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const logo = pickLogo(indexRef.current);
      indexRef.current += 1;

      const badge = document.createElement("div");
      badge.textContent = logo.label;
      badge.className =
        "pointer-events-none absolute rounded-full border border-cyan-400/60 bg-black/80 px-3 py-1 text-xs font-semibold text-cyan-300";
      badge.style.left = `${event.clientX - rect.left}px`;
      badge.style.top = `${event.clientY - rect.top}px`;
      container.appendChild(badge);

      gsap.fromTo(
        badge,
        { opacity: 1, scale: 1 },
        {
          opacity: 0,
          scale: 0.6,
          duration: 1,
          ease: "power1.out",
          onComplete: () => badge.remove(),
        }
      );
    },
    [containerRef]
  );
}
```

- [ ] **Step 6: Implement `SponsorsSection`**

`src/components/sponsors/SponsorsSection.tsx`:
```tsx
import { useRef } from "react";
import { useLogoTrail } from "./useLogoTrail";

export function SponsorsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = useLogoTrail(containerRef);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex h-64 items-center justify-center overflow-hidden bg-black"
    >
      <h2 className="text-3xl font-bold text-white sm:text-4xl">
        Engage sponsors like never before.
      </h2>
    </section>
  );
}
```

- [ ] **Step 7: Wire into `App`**

`src/App.tsx`:
```tsx
import { Hero } from "./components/hero/Hero";
import { SponsorsSection } from "./components/sponsors/SponsorsSection";

export function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <SponsorsSection />
    </div>
  );
}
```

- [ ] **Step 8: Run tests**

Run: `npm test`
Expected: all PASS

- [ ] **Step 9: Manually verify in browser**

Run: `npm run dev`. Move the mouse across the sponsors section.
Expected: small cyan-outlined logo-name badges spawn near the cursor and fade out behind it as it moves.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: sponsors section with cursor-follow logo trail"
```

---

### Task 6: Lead Validation & Supabase Client

**Files:**
- Create: `src/lib/validation.ts`, `src/lib/supabase.ts`, `src/lib/leads.ts`, `.env.example`
- Test: `src/lib/validation.test.ts`, `src/lib/leads.test.ts`

**Interfaces:**
- Produces: `isValidEmail(value: string): boolean`; `ORGANIZER_ROLES` (readonly tuple), `OrganizerRole` type, `isValidOrganizerRole(value: string): value is OrganizerRole` (from `validation.ts`); `supabase` client instance (from `supabase.ts`); `Track` type, `LeadPayload` interface, `buildLeadPayload(email: string, track: Track, role: OrganizerRole | null): LeadPayload`, `submitLead(payload: LeadPayload): Promise<void>` (from `leads.ts`) — consumed directly by Tasks 7 and 8.

- [ ] **Step 1: Write validation tests**

`src/lib/validation.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { isValidEmail, isValidOrganizerRole, ORGANIZER_ROLES } from "./validation";

describe("isValidEmail", () => {
  it("accepts a well-formed email", () => {
    expect(isValidEmail("person@example.com")).toBe(true);
  });

  it("rejects a string with no @", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isValidOrganizerRole", () => {
  it("accepts every role in ORGANIZER_ROLES", () => {
    ORGANIZER_ROLES.forEach((role) => expect(isValidOrganizerRole(role)).toBe(true));
  });

  it("rejects an unknown role", () => {
    expect(isValidOrganizerRole("astronaut")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- validation`
Expected: FAIL — module not found

- [ ] **Step 3: Implement `validation.ts`**

```ts
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const ORGANIZER_ROLES = ["event_owner", "location_owner", "organizer", "other"] as const;
export type OrganizerRole = (typeof ORGANIZER_ROLES)[number];

export function isValidOrganizerRole(value: string): value is OrganizerRole {
  return (ORGANIZER_ROLES as readonly string[]).includes(value);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- validation`
Expected: PASS

- [ ] **Step 5: Create the Supabase client**

`src/lib/supabase.ts`:
```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your Supabase project credentials."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

`.env.example`:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

- [ ] **Step 6: Write lead tests (mocking the Supabase client)**

`src/lib/leads.test.ts`:
```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const insertMock = vi.fn();

vi.mock("./supabase", () => ({
  supabase: {
    from: () => ({ insert: insertMock }),
  },
}));

const { buildLeadPayload, submitLead } = await import("./leads");

beforeEach(() => {
  insertMock.mockReset();
});

describe("buildLeadPayload", () => {
  it("builds an attendee payload with a null role and the landing source", () => {
    expect(buildLeadPayload("person@example.com", "attendee", null)).toEqual({
      email: "person@example.com",
      track: "attendee",
      role: null,
      source: "wap-landing",
    });
  });

  it("trims whitespace from the email", () => {
    expect(buildLeadPayload("  person@example.com  ", "attendee", null).email).toBe(
      "person@example.com"
    );
  });
});

describe("submitLead", () => {
  it("inserts the payload and resolves when there is no error", async () => {
    insertMock.mockResolvedValue({ error: null });
    await expect(
      submitLead(buildLeadPayload("a@b.com", "organizer", "event_owner"))
    ).resolves.toBeUndefined();
    expect(insertMock).toHaveBeenCalledWith({
      email: "a@b.com",
      track: "organizer",
      role: "event_owner",
      source: "wap-landing",
    });
  });

  it("throws when Supabase returns an error", async () => {
    insertMock.mockResolvedValue({ error: { message: "insert failed" } });
    await expect(
      submitLead(buildLeadPayload("a@b.com", "attendee", null))
    ).rejects.toThrow("insert failed");
  });
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npm test -- leads`
Expected: FAIL — `leads` module not found

- [ ] **Step 8: Implement `leads.ts`**

```ts
import { supabase } from "./supabase";
import type { OrganizerRole } from "./validation";

export type Track = "attendee" | "organizer";

export interface LeadPayload {
  email: string;
  track: Track;
  role: OrganizerRole | null;
  source: string;
}

export function buildLeadPayload(
  email: string,
  track: Track,
  role: OrganizerRole | null
): LeadPayload {
  return { email: email.trim(), track, role, source: "wap-landing" };
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const { error } = await supabase.from("leads").insert(payload);
  if (error) {
    throw new Error(error.message);
  }
}
```

- [ ] **Step 9: Add a placeholder `.env.local` so tests/build don't crash locally**

```bash
cp .env.example .env.local
```

(Real values get filled in during Task 10 once the Supabase project exists. The mocked `submitLead` tests don't need real credentials since `supabase.ts` throws only if the env vars are entirely absent — `.env.local` copied from the example has non-empty placeholder strings, which is enough to satisfy the guard.)

- [ ] **Step 10: Run tests to verify they pass**

Run: `npm test`
Expected: all PASS

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: lead validation and Supabase lead submission"
```

(`.env.local` is gitignored per Task 1 — only `.env.example` gets committed.)

---

### Task 7: Attendee Section & Form

**Files:**
- Create: `src/components/forms/EmailField.tsx`, `src/components/forms/AttendeeForm.tsx`, `src/components/sections/AttendeesSection.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/forms/AttendeeForm.test.tsx`

**Interfaces:**
- Consumes: `isValidEmail` (Task 6), `buildLeadPayload`, `submitLead` (Task 6)
- Produces: `Button`, `Input` (shadcn components at `src/components/ui/`); `EmailField` component (props: `{ value: string; onChange: (v: string) => void; error: string | null }`); `AttendeeForm` component (no props); `AttendeesSection` component (no props).

- [ ] **Step 1: Initialize shadcn/ui and add components**

```bash
npx shadcn@latest init
npx shadcn@latest add button input
```

Follow the CLI prompts (base color: neutral, no other customization needed). If the interactive prompts differ from a standard `init`, consult the installed `shadcn` skill for current flags. Expected result: `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, and `src/lib/utils.ts` (a `cn()` class-merging helper) are created, and `components.json` is added to the repo root.

- [ ] **Step 2: Write the failing form test**

`src/components/forms/AttendeeForm.test.tsx`:
```tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const submitLeadMock = vi.fn();

vi.mock("../../lib/leads", async () => {
  const actual = await vi.importActual<typeof import("../../lib/leads")>("../../lib/leads");
  return { ...actual, submitLead: submitLeadMock };
});

const { AttendeeForm } = await import("./AttendeeForm");

beforeEach(() => {
  submitLeadMock.mockReset();
});

describe("AttendeeForm", () => {
  it("shows an error for an invalid email and does not submit", async () => {
    render(<AttendeeForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: /get early access/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(submitLeadMock).not.toHaveBeenCalled();
  });

  it("submits a valid email and shows the thank-you state", async () => {
    submitLeadMock.mockResolvedValue(undefined);
    render(<AttendeeForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), "person@example.com");
    await userEvent.click(screen.getByRole("button", { name: /get early access/i }));
    expect(await screen.findByText(/thanks/i)).toBeInTheDocument();
    expect(submitLeadMock).toHaveBeenCalledWith({
      email: "person@example.com",
      track: "attendee",
      role: null,
      source: "wap-landing",
    });
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- AttendeeForm`
Expected: FAIL — `AttendeeForm` module not found

- [ ] **Step 4: Implement `EmailField`**

`src/components/forms/EmailField.tsx`:
```tsx
import { Input } from "../ui/input";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export function EmailField({ value, onChange, error }: EmailFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Input
        type="email"
        placeholder="you@example.com"
        aria-label="Email address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 5: Implement `AttendeeForm`**

`src/components/forms/AttendeeForm.tsx`:
```tsx
import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { EmailField } from "./EmailField";
import { isValidEmail } from "../../lib/validation";
import { buildLeadPayload, submitLead } from "../../lib/leads";

export function AttendeeForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      await submitLead(buildLeadPayload(email, "attendee", null));
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return <p className="text-cyan-400">Thanks — we'll be in touch.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <EmailField value={email} onChange={setEmail} error={error} />
      <Button type="submit" disabled={status === "submitting"}>
        Get early access
      </Button>
    </form>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- AttendeeForm`
Expected: PASS

- [ ] **Step 7: Implement `AttendeesSection`**

`src/components/sections/AttendeesSection.tsx`:
```tsx
import { AttendeeForm } from "../forms/AttendeeForm";

export function AttendeesSection() {
  return (
    <section id="attendees" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="mb-4 text-3xl font-bold">For Attendees</h2>
      <p className="mb-8 text-white/80">
        See who's already in the room, trade contacts with a tap, post to the
        live feed, and unlock perks the more you engage — WAP turns any event
        into a room full of people worth knowing.
      </p>
      <AttendeeForm />
    </section>
  );
}
```

- [ ] **Step 8: Wire into `App`**

`src/App.tsx`:
```tsx
import { Hero } from "./components/hero/Hero";
import { SponsorsSection } from "./components/sponsors/SponsorsSection";
import { AttendeesSection } from "./components/sections/AttendeesSection";

export function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <SponsorsSection />
      <AttendeesSection />
    </div>
  );
}
```

- [ ] **Step 9: Run all tests**

Run: `npm test`
Expected: all PASS

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: attendee section with email capture form"
```

---

### Task 8: Organizer Section & Form

**Files:**
- Create: `src/components/forms/RoleSelect.tsx`, `src/components/forms/OrganizerForm.tsx`, `src/components/sections/OrganizersSection.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/forms/OrganizerForm.test.tsx`

**Interfaces:**
- Consumes: `EmailField` (Task 7), `ORGANIZER_ROLES`, `OrganizerRole`, `isValidOrganizerRole`, `isValidEmail` (Task 6), `buildLeadPayload`, `submitLead` (Task 6)
- Produces: `RoleSelect` component (props: `{ value: OrganizerRole | ""; onChange: (v: OrganizerRole | "") => void }`); `OrganizerForm`, `OrganizersSection` components (no props).

- [ ] **Step 1: Write the failing form test**

`src/components/forms/OrganizerForm.test.tsx`:
```tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const submitLeadMock = vi.fn();

vi.mock("../../lib/leads", async () => {
  const actual = await vi.importActual<typeof import("../../lib/leads")>("../../lib/leads");
  return { ...actual, submitLead: submitLeadMock };
});

const { OrganizerForm } = await import("./OrganizerForm");

beforeEach(() => {
  submitLeadMock.mockReset();
});

describe("OrganizerForm", () => {
  it("requires a role before submitting", async () => {
    render(<OrganizerForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), "owner@example.com");
    await userEvent.click(screen.getByRole("button", { name: /talk to us/i }));
    expect(await screen.findByText(/select your role/i)).toBeInTheDocument();
    expect(submitLeadMock).not.toHaveBeenCalled();
  });

  it("submits with email and role, and shows the thank-you state", async () => {
    submitLeadMock.mockResolvedValue(undefined);
    render(<OrganizerForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), "owner@example.com");
    await userEvent.selectOptions(screen.getByLabelText(/your role/i), "event_owner");
    await userEvent.click(screen.getByRole("button", { name: /talk to us/i }));
    expect(await screen.findByText(/thanks/i)).toBeInTheDocument();
    expect(submitLeadMock).toHaveBeenCalledWith({
      email: "owner@example.com",
      track: "organizer",
      role: "event_owner",
      source: "wap-landing",
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- OrganizerForm`
Expected: FAIL — `OrganizerForm` module not found

- [ ] **Step 3: Implement `RoleSelect`**

A plain native `<select>` is used here instead of a shadcn Select — this is a single, simple dropdown with no need for the extra Radix-based styling/portal complexity, and it keeps the test above straightforward (`userEvent.selectOptions` works directly against native selects).

`src/components/forms/RoleSelect.tsx`:
```tsx
import { ORGANIZER_ROLES, type OrganizerRole } from "../../lib/validation";

const ROLE_LABELS: Record<OrganizerRole, string> = {
  event_owner: "Event Owner",
  location_owner: "Location Owner",
  organizer: "Organizer",
  other: "Other",
};

interface RoleSelectProps {
  value: OrganizerRole | "";
  onChange: (value: OrganizerRole | "") => void;
}

export function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <select
      aria-label="Your role"
      value={value}
      onChange={(e) => onChange(e.target.value as OrganizerRole | "")}
      className="rounded-md border border-white/20 bg-black px-3 py-2 text-white"
    >
      <option value="">Select your role</option>
      {ORGANIZER_ROLES.map((role) => (
        <option key={role} value={role}>
          {ROLE_LABELS[role]}
        </option>
      ))}
    </select>
  );
}
```

- [ ] **Step 4: Implement `OrganizerForm`**

`src/components/forms/OrganizerForm.tsx`:
```tsx
import { useState, type FormEvent } from "react";
import { Button } from "../ui/button";
import { EmailField } from "./EmailField";
import { RoleSelect } from "./RoleSelect";
import { isValidEmail, isValidOrganizerRole, type OrganizerRole } from "../../lib/validation";
import { buildLeadPayload, submitLead } from "../../lib/leads";

export function OrganizerForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<OrganizerRole | "">("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!isValidOrganizerRole(role)) {
      setError("Select your role.");
      return;
    }
    setError(null);
    setStatus("submitting");
    try {
      await submitLead(buildLeadPayload(email, "organizer", role));
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("idle");
    }
  }

  if (status === "done") {
    return <p className="text-cyan-400">Thanks — we'll be in touch.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <EmailField value={email} onChange={setEmail} error={null} />
      <RoleSelect value={role} onChange={setRole} />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={status === "submitting"}>
        Talk to us about your event
      </Button>
    </form>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- OrganizerForm`
Expected: PASS

- [ ] **Step 6: Implement `OrganizersSection`**

`src/components/sections/OrganizersSection.tsx`:
```tsx
import { OrganizerForm } from "../forms/OrganizerForm";

export function OrganizersSection() {
  return (
    <section id="organizers" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="mb-4 text-3xl font-bold">For Organizers</h2>
      <p className="mb-8 text-white/80">
        Run check-ins, track engagement, and manage rewards for your venue or
        event from one admin portal — with an audience that's already primed
        to connect.
      </p>
      <OrganizerForm />
    </section>
  );
}
```

- [ ] **Step 7: Wire into `App`**

`src/App.tsx`:
```tsx
import { Hero } from "./components/hero/Hero";
import { SponsorsSection } from "./components/sponsors/SponsorsSection";
import { AttendeesSection } from "./components/sections/AttendeesSection";
import { OrganizersSection } from "./components/sections/OrganizersSection";

export function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <SponsorsSection />
      <AttendeesSection />
      <OrganizersSection />
    </div>
  );
}
```

- [ ] **Step 8: Run all tests**

Run: `npm test`
Expected: all PASS

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: organizer section with role-segmented lead form"
```

---

### Task 9: Nav, Footer, Router & Full Page Assembly

**Files:**
- Create: `src/components/brand/WMark.tsx`, `src/components/layout/Nav.tsx`, `src/components/layout/Footer.tsx`, `src/pages/LandingPage.tsx`, `public/brand/w-mark.png`
- Modify: `src/App.tsx`
- Test: `src/pages/LandingPage.test.tsx`

**Interfaces:**
- Consumes: `Hero` (Task 4), `SponsorsSection` (Task 5), `AttendeesSection` (Task 7), `OrganizersSection` (Task 8)
- Produces: `WMark` component (props: `{ className?: string }`); `Nav`, `Footer`, `LandingPage` components (no props). `App` becomes a router shell — this is the last task that modifies `App.tsx`.

- [ ] **Step 1: Copy the brand mark asset**

```bash
mkdir -p public/brand
cp "/Users/sr/Downloads/wap logo/8.png" public/brand/w-mark.png
```

- [ ] **Step 2: Implement `WMark`**

`src/components/brand/WMark.tsx`:
```tsx
interface WMarkProps {
  className?: string;
}

export function WMark({ className }: WMarkProps) {
  return <img src="/brand/w-mark.png" alt="The W App" className={className} />;
}
```

- [ ] **Step 3: Implement `Nav`**

`src/components/layout/Nav.tsx`:
```tsx
import { WMark } from "../brand/WMark";

export function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <WMark className="h-8 w-8" />
      <div className="flex gap-6 text-sm text-white/80">
        <a href="#attendees" className="hover:text-cyan-400">
          For Attendees
        </a>
        <a href="#organizers" className="hover:text-cyan-400">
          For Organizers
        </a>
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Implement `Footer`**

`src/components/layout/Footer.tsx`:
```tsx
import { WMark } from "../brand/WMark";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 border-t border-white/10 px-6 py-10 text-center text-white/60">
      <WMark className="h-6 w-6" />
      <p className="text-sm italic">Life Worth Living Well</p>
      <p className="text-xs">&copy; {new Date().getFullYear()} The W App</p>
    </footer>
  );
}
```

- [ ] **Step 5: Write the LandingPage smoke test**

`src/pages/LandingPage.test.tsx`:
```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../lib/leads", async () => {
  const actual = await vi.importActual<typeof import("../lib/leads")>("../lib/leads");
  return { ...actual, submitLead: vi.fn() };
});

const { LandingPage } = await import("./LandingPage");

describe("LandingPage", () => {
  it("renders every major section", () => {
    render(<LandingPage />);
    expect(screen.getByText("WHO")).toBeInTheDocument();
    expect(screen.getByText("QR Connect")).toBeInTheDocument();
    expect(screen.getByText("Live Feed")).toBeInTheDocument();
    expect(screen.getByText("Rewards")).toBeInTheDocument();
    expect(screen.getByText(/engage sponsors like never before/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /for attendees/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /for organizers/i })).toBeInTheDocument();
    expect(screen.getByText(/life worth living well/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- LandingPage`
Expected: FAIL — `LandingPage` module not found

- [ ] **Step 7: Implement `LandingPage`**

`src/pages/LandingPage.tsx`:
```tsx
import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/hero/Hero";
import { SponsorsSection } from "../components/sponsors/SponsorsSection";
import { AttendeesSection } from "../components/sections/AttendeesSection";
import { OrganizersSection } from "../components/sections/OrganizersSection";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <Hero />
      <SponsorsSection />
      <AttendeesSection />
      <OrganizersSection />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 8: Replace `App` with a router shell**

`src/App.tsx`:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

Update `src/App.test.tsx` (still just a smoke test, now through the router):
```tsx
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("./lib/leads", async () => {
  const actual = await vi.importActual<typeof import("./lib/leads")>("./lib/leads");
  return { ...actual, submitLead: vi.fn() };
});

const { App } = await import("./App");

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
  });
});
```

- [ ] **Step 9: Run all tests**

Run: `npm test`
Expected: all PASS

- [ ] **Step 10: Manually verify the full page in the browser**

Run: `npm run dev`. Scroll top to bottom.
Expected: Nav with W mark and links → Hero → Sponsors → For Attendees (with form) → For Organizers (with form) → Footer with W mark and tagline. Nav links jump to the matching section.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: assemble full landing page with nav, footer, and routing"
```

---

### Task 10: Supabase Project Provisioning

**Files:**
- Create: `supabase/migrations/0001_create_leads_table.sql`
- Modify: `README.md`

**Interfaces:**
- None — this task documents and scripts the database side; no application code changes.

- [ ] **Step 1: Write the migration SQL**

`supabase/migrations/0001_create_leads_table.sql`:
```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  track text not null check (track in ('attendee', 'organizer')),
  role text check (role in ('event_owner', 'location_owner', 'organizer', 'other')),
  source text not null default 'wap-landing',
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Allow public inserts" on public.leads
  for insert
  to anon
  with check (true);
```

- [ ] **Step 2: Document provisioning steps in the README**

Add to `README.md`:
```markdown
## Supabase setup (one-time, manual)

This project uses its own standalone Supabase project — separate from the WAP app's production database.

1. Create a new project at https://supabase.com/dashboard.
2. Open the SQL Editor and run `supabase/migrations/0001_create_leads_table.sql`.
3. Copy your project's URL and anon key (Project Settings → API).
4. Copy `.env.example` to `.env.local` and fill in both values.
5. Run `npm run dev` — the lead-capture forms will now insert real rows into the `leads` table.
```

- [ ] **Step 3: Verify the app still builds without real credentials**

Run: `npm run build`
Expected: build succeeds (the Supabase env-var guard in `src/lib/supabase.ts` only throws at runtime when the app actually loads, not at build time).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add Supabase leads table migration and setup instructions"
```

- [ ] **Step 5: Manual follow-up (you, not the engineer executing this plan)**

Create the actual Supabase project per the README steps above, and replace the placeholder values in your local `.env.local` with the real project URL and anon key. Until this is done, the forms will show a runtime error rather than silently failing — this is intentional.

---

## Self-Review Notes

- **Spec coverage:** Location/stack (Task 1), visual language (Tasks 1, 2, 9), hero interaction incl. gestures (Tasks 2–4), sponsors trail (Task 5), attendee/organizer forms + role segmentation (Tasks 6–8), footer/nav (Task 9), data capture schema (Tasks 6, 10), future routing (Task 9's `BrowserRouter`). All spec sections have a corresponding task.
- **Type consistency checked:** `ZoneId`, `OrganizerRole`, `Track`, `LeadPayload` are defined once (Tasks 2, 6) and reused with identical names/shapes in every later task that touches them.
- **No placeholder steps:** every code step above is complete, runnable code — the only human-only step is Task 10 Step 5 (creating a third-party hosted account), which is a legitimate manual action, not a deferred design decision.
