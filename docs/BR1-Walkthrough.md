# BR1 – Design System Audit & Component Standardisation Walkthrough

## Overview

BR1 was a zero-new-feature sprint focused entirely on making FeedHope look and feel like a consistent, premium product across all six screens before closed beta.

No database changes. No routing changes. Every change is purely presentational.

---

## What Changed

### Phase 1 – Foundation

#### [`globals.css`](file:///c:/Projects/FeedHope/src/app/globals.css)
- **Fixed the silent font override**: `font-family: Arial, Helvetica, sans-serif` was removed from `body`. The font is now `var(--font-geist-sans)` (Geist, loaded by `layout.tsx`), with `system-ui` as a fallback. Every screen now renders in the correct typeface.
- **Added CSS custom-property shadow tokens**: `--shadow-card`, `--shadow-card-hover`, `--shadow-modal` — exposed as `.shadow-card`, `.shadow-card-hover`, `.shadow-modal` utility classes consumed by the new component library.

---

### Phase 2 – Shared Component Library (`src/components/ui/`)

| Component | Purpose |
|---|---|
| [`Button`](file:///c:/Projects/FeedHope/src/components/ui/Button.tsx) | Single source-of-truth button. Variants: `primary` (violet), `secondary` (border), `ghost` (text), `danger` (red-border). Built-in loading spinner, `focus-visible` ring, `cursor-not-allowed` on disabled. |
| [`Input`](file:///c:/Projects/FeedHope/src/components/ui/Input.tsx) | Standardised input with label, error state (`aria-invalid` + `aria-describedby`), optional suffix unit, violet focus ring, `rounded-xl` + `py-3` height. |
| [`FormCard`](file:///c:/Projects/FeedHope/src/components/ui/FormCard.tsx) | White `rounded-3xl shadow-modal border-gray-100` card — the consistent container for auth and onboarding pages. |
| [`ErrorBanner`](file:///c:/Projects/FeedHope/src/components/ui/ErrorBanner.tsx) | Inline error alert with `AlertCircle` icon and consistent `rounded-xl border-red-200` styling. Replaces 3 different ad-hoc implementations. |
| [`Badge`](file:///c:/Projects/FeedHope/src/components/ui/Badge.tsx) | Coloured pill/tag (6 variants). Replaces inline spans in `ReviewStep`. |

---

### Phase 3 – Auth Screens Restyle

Both Login and Register now look and feel like part of FeedHope:

| Before | After |
|---|---|
| Plain white background | Gradient `from-slate-50 via-white to-violet-50` (matching onboarding) |
| `rounded-lg shadow-sm` card | `FormCard` — `rounded-3xl shadow-modal` |
| `rounded bg-blue-600 py-2` button | `Button` primary — violet, `rounded-xl`, `py-2.5`, focus ring |
| `rounded border-gray-300 p-2` inputs | `Input` — `rounded-xl py-3 px-4 bg-gray-50`, violet focus ring |
| Bare red `<div>` error banner | `ErrorBanner` with `AlertCircle` icon |
| No brand identity | FeedHope wordmark with gradient + tagline |

---

### Phase 4 – Onboarding Polish

| Change | Files affected |
|---|---|
| Decorative emoji (`🌱`, `📋`, etc.) wrapped with `aria-hidden` + `sr-only` description | `WelcomeStep.tsx`, `SuccessStep.tsx` |
| Text `✓` checkmark → Lucide `<Check />` icon | `GoalsStep.tsx`, `HealthConditionsStep.tsx`, `LifestyleStep.tsx` |
| Lifestyle step selection indicator → Lucide `<Check />` | `LifestyleStep.tsx` |
| All Back/Continue buttons → `Button` component | All 5 step components |
| Review submit button: emerald gradient → `Button` primary violet | `ReviewStep.tsx` |
| Ad-hoc red error div → `ErrorBanner` | `ReviewStep.tsx` |
| `LogoutButton`: `bg-red-600 rounded` → `Button` variant=danger (border style) | `LogoutButton.tsx` |

---

### Phase 5 – Dashboard & Progress Consistency

| Change | File |
|---|---|
| `Minus` icon (dual meaning) → `ArrowRight` for "Stable" trend | `TrendIndicator.tsx` |
| `font-black` → `font-bold` on personal-best values | `PersonalBestsSection.tsx` |

---

### Phase 6 – Landing Page

[`src/app/page.tsx`](file:///c:/Projects/FeedHope/src/app/page.tsx) — completely replaced the default Next.js scaffold with a proper FeedHope landing page:

- **Sticky nav**: wordmark + "Sign in" + "Get started" CTA
- **Hero section**: gradient background, decorative blobs, headline with gradient text, two CTAs
- **Stats strip**: 4 metric highlights (tracked metrics, insights, sleep, steps)
- **Feature cards**: 3 cards (Personalised Plan · Daily Check-ins · Weekly Insights) using `rounded-3xl shadow-card`
- **CTA banner**: violet gradient with white CTA
- **Footer**: wordmark, privacy note, nav links
- Proper `<title>` and `<meta description>` via `export const metadata`

---

## Design Token Summary

| Token | Value | Usage |
|---|---|---|
| Brand primary | `violet-600` (#7c3aed) | All CTAs, focus rings, active states |
| Brand accent | `emerald-500` | Success states, progress indicators |
| Error | `red-600` / `red-500` / `red-50` | Banners, field errors |
| Card radius | `rounded-3xl` (24px) | All card containers |
| Input radius | `rounded-xl` (12px) | All inputs and option buttons |
| Shadow card | `0 2px 10px -4px rgba(0,0,0,0.08)` | Dashboard/progress cards |
| Shadow modal | `0 20px 40px -8px …` | Auth/onboarding container |
| Font | Geist Sans | All screens (now applied correctly) |

---

## Build & Lint Results

```
✓ Compiled successfully in 1993ms
✓ TypeScript — zero errors (tsc --noEmit)
✓ 10/10 static pages generated
✓ Zero new ESLint warnings in modified files
```

---

## Manual Verification Checklist

- [ ] Tab through Login → inputs and button show violet focus ring
- [ ] Tab through Register → same
- [ ] Login/Register pages: card has same radius/shadow as onboarding
- [ ] Onboarding goals step: Lucide Check renders inside selected checkboxes
- [ ] Review submit button is **violet** (not green)
- [ ] LogoutButton shows border-red style, not filled red
- [ ] Dashboard progress page: Stable trend shows ArrowRight (not Minus)
- [ ] Landing page at `/` renders FeedHope branding, not Next.js scaffold
- [ ] Mobile (375px): landing page hero is readable, nav doesn't overflow
- [ ] No Arial font visible on any screen (open DevTools → Computed → font-family should show Geist)
