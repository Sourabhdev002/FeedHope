# BR1 – Design System Audit

> **Status**: Planning phase — no production code has been changed.
> All findings are based on a full static-code review of every screen.

See the full implementation plan in the approval artifact.
This file is the permanent project record of the audit findings.

---

## Screens Audited

| Screen | Route | Files inspected |
|---|---|---|
| Landing | `/` | `src/app/page.tsx` |
| Login | `/login` | `src/app/(auth)/login/page.tsx` |
| Register | `/register` | `src/app/(auth)/register/page.tsx` |
| Onboarding | `/onboarding` | `OnboardingWizard.tsx` + 7 step components + `ProgressBar.tsx` |
| Dashboard | `/dashboard` | `src/app/(protected)/dashboard/page.tsx` + `TrackerGrid.tsx` + `HabitTracker.tsx` + `Greeting.tsx` |
| Progress | `/dashboard/progress` | `src/app/(protected)/dashboard/progress/page.tsx` + 5 progress components |
| Shared | — | `LogoutButton.tsx`, `BottomNav.tsx`, `globals.css`, `layout.tsx`, `package.json` |

---

## Critical Findings Summary

### P0 – Blocker
- Landing page is the unmodified Next.js default scaffold (no FeedHope branding).

### P1 – High (must fix before closed beta)
1. Auth screens use `bg-blue-600` buttons and `rounded` (4px) inputs — completely different brand from the rest of the app (violet, rounded-xl).
2. `LogoutButton` uses aggressive `bg-red-600 rounded` — wrong colour and wrong radius.
3. Three distinct primary-action colours across the app: `blue-600` (auth), `violet-600` (onboarding), `indigo-500` (dashboard).
4. `globals.css` body font is `Arial` — overrides the Geist font loaded by `layout.tsx` in any unstyled context.
5. No `Button` or `Input` component — 8+ button variants and 2 input styles duplicated ad-hoc.
6. No `focus-visible` ring on any button (keyboard accessibility gap).

### P2 – Medium
7. Review step "Submit" button switches to green gradient — inconsistent with all other CTAs.
8. Shadow system has three approaches: Tailwind named scale, arbitrary CSS values, semantic-coloured shadows.
9. Emoji used as icons in Onboarding (accessibility and cross-platform inconsistency).
10. `font-black` appears only in Progress PB values — inconsistent with `font-bold` everywhere else.

### P3 – Low
11. Section bottom-margins vary (mb-4 / mb-6 / mb-10) with no documented token.
12. `Minus` icon has dual semantic meaning (decrement in Sleep tracker; stable trend in Progress).
13. `ErrorBanner` duplicated across Login, Register, ReviewStep.
14. PB cards use `rounded-2xl` while surrounding metric cards use `rounded-3xl`.

---

## Design Token Proposal (summary)

### Brand Colour Decision Required
> **Q**: Should FeedHope primary be **violet** (`#7c3aed`) or **indigo** (`#6366f1`)?
> Recommendation: **violet** — it is used in the more intentional onboarding design.

### Proposed Tokens

| Category | Key tokens |
|---|---|
| Primary | `violet-600` (#7c3aed), `violet-700`, `violet-100` |
| Success / Accent | `emerald-500` (#10b981), `emerald-100` |
| Error | `red-600` (banners), `red-500` (field), `red-50` (bg) |
| Neutral | `gray-900` headings → `gray-400` captions |
| Page bg | `#fafafa` |
| Surface | `#ffffff` |

| Category | Token → Value |
|---|---|
| Radius | sm=`rounded-lg` · md=`rounded-xl` · lg=`rounded-2xl` · xl=`rounded-3xl` |
| Shadow | card=`shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)]` · modal=`shadow-xl shadow-gray-200/60` |
| Font | Geist Sans (already loaded) — ensure it applies globally |

---

## Component Inventory

### Needs to be created
- `src/components/ui/Button.tsx` — variants: primary, secondary, ghost, danger
- `src/components/ui/Input.tsx` — with label, error, suffix
- `src/components/ui/FormCard.tsx` — white auth/onboarding container card
- `src/components/ui/ErrorBanner.tsx` — inline error alert
- `src/components/ui/PageShell.tsx` — full-page wrapper
- `src/components/ui/Badge.tsx` — inline tag/pill

### Needs to be refactored
- `LogoutButton.tsx` — use `Button` danger variant
- `src/app/(auth)/login/page.tsx` — use `Button`, `Input`, `FormCard`, `ErrorBanner`
- `src/app/(auth)/register/page.tsx` — use `Button`, `Input`, `FormCard`, `ErrorBanner`
- `ReviewStep.tsx` — submit button changed from emerald to primary violet

### Needs to be replaced
- `src/app/page.tsx` — replace Next.js scaffold with FeedHope landing page

---

## Implementation Plan

### Phase 1 — Foundation
- Fix `globals.css` font
- Define shared Tailwind custom utilities / shadow values

### Phase 2 — Shared Component Library
- Create `src/components/ui/` with 6 components listed above

### Phase 3 — Auth Screens Restyle
- Login + Register: inputs, buttons, card, error banner

### Phase 4 — Onboarding Polish
- Replace text `✓` with Lucide `Check`; fix submit button colour; extract `OptionGroup`

### Phase 5 — Dashboard & Progress Consistency
- LogoutButton, gap/margin standardisation, icon disambiguation

### Phase 6 — Landing Page
- Scope TBD (see Open Questions below)

### Phase 7 — Verification
- `npm run build` + `npm run lint` + manual tab-through + mobile viewport check

---

## Open Questions

1. **Brand primary**: violet (`#7c3aed`) or indigo (`#6366f1`)?
2. **Landing page scope**: Full marketing page or simple redirect to `/login`?
3. **Dark mode**: Remove scaffolding (`dark:` classes) or retain for future?
4. **Emoji in onboarding**: Replace with Lucide icons or wrap with `aria-hidden`?
