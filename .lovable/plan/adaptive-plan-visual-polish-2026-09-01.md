# Adaptive plan + visual polish

## 1. Plan personalization loop

Today each plan step is fixed text (title + detail) with a daily tick. Add a feedback loop so the plan responds to you.

- Every step gets a small "Too easy / Just right / Too hard" control next to the checkmark.
- Each step gains three levels of prescription: **gentler**, **standard**, and **progressed** (e.g. calf raises: 2 x 10 with support -> 3 x 15 slow lowering -> 3 x 12 single-leg with a pause). Written per step for every focus area, physical and psychological.
- Choosing "too hard" drops the step one level, "too easy" raises it one level, "just right" holds. The card then shows the adjusted prescription plus a quiet "Adjusted for you" tag and an undo.
- Safety rails: steps never go above the level appropriate for the current recovery phase, "too hard" repeated twice adds a gentle note suggesting checking in with a clinician, and nothing is framed as medical advice.
- A short "Your adjustments" summary at the top of My Plan says how many steps are easier or harder than baseline, with a reset-to-baseline option.
- Choices persist per user alongside the existing saved state, so the plan stays adapted on return.

## 2. Polish pass

- Empty states with warmth: Journal, Readiness, Identity, and Community show a friendly first-time card instead of blank space.
- Loading and saving feedback: consistent skeletons and button pending states on AI calls and saves.
- Accessibility: honour reduced motion (the pulsing plan dot stops animating), larger tap targets on mobile, and a contrast check on gold text over light surfaces.
- Small consistency fixes: uniform page headers, consistent card padding, and matching spacing between the dashboard and inner pages.

## 3. Visual richness (no structural change)

Same palette, same layout, more depth:

- Layered surfaces: subtle warm-stone tint behind sections so cards separate from the page instead of floating on flat ivory.
- Gold used with intent: hairline dividers, section eyebrows, and one accent element per screen rather than everywhere.
- A soft navy-to-sage gradient band on the dashboard greeting and the landing hero.
- More typographic contrast: larger serif page titles, smaller uppercase tracked labels, tighter body measure.
- Gentle depth on cards: refined shadow, slight hover lift on interactive cards only.
- Texture: a very light grain or radial glow behind hero areas so large ivory zones do not read as empty.

## Review before building

Before any of the visual work is applied, I will capture the current dashboard and generate three rendered design directions built on the existing palette and layout so you can pick one. Nothing visual gets committed until you choose.

## Technical notes

- Extend `PlanTask` in `src/data/plans.ts` with `levels: { gentler, standard, progressed }`.
- Add `taskLevels: Record<string, -1 | 0 | 1>` to `AdagioState` in `src/lib/store.tsx` with a setter; existing saved state loads with defaults.
- Feedback control lives in the plan step card in `src/pages/app/Plan.tsx`, reusing `TaskDetailDialog` for the expanded view.
- Visual changes stay in `src/index.css` and `tailwind.config.ts` tokens plus component class usage — no new hardcoded colours.
- No backend changes; everything stays in the current per-user local state.
