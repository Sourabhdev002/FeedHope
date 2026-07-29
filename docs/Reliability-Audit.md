# Reliability Audit

**Date:** 2026-07-29

This document assesses every core user flow against standard resilient states: Success, Loading, Empty, Validation Error, Server Error, and Session Expired.

## 1. Landing (`/`)
- **Success State:** Static/SSR render completes successfully.
- **Loading State:** Missing. No `loading.tsx` boundary.
- **Empty State:** N/A.
- **Validation Error State:** N/A.
- **Server Error State:** Missing. No global `error.tsx`. If the server fails, users see a raw Next.js 500 error page.
- **Session Expired State:** N/A (Public route).

## 2. Register (`/register`)
- **Success State:** Form submits, creates user, redirects to `/dashboard`.
- **Loading State:** Handled gracefully on the Submit button (`isLoading`).
- **Empty State:** N/A.
- **Validation Error State:** Handled gracefully via HTML5 validation and `ErrorBanner` for API-level validation.
- **Server Error State:** Captured in `catch` block; displays a generic "An unexpected error occurred" via `ErrorBanner`.
- **Session Expired State:** N/A.

## 3. Login (`/login`)
- **Success State:** Redirects to `/dashboard`.
- **Loading State:** Handled gracefully (`isLoading` on button).
- **Empty State:** N/A.
- **Validation Error State:** Handled via `ErrorBanner` ("Invalid credentials").
- **Server Error State:** Handled via `ErrorBanner`.
- **Session Expired State:** Handled implicitly (unauthenticated users are redirected here).

## 4. Logout (`<LogoutButton>`)
- **Success State:** Clears session and redirects to `/login`.
- **Loading State:** Missing. Button remains active while request is in flight (risk of multi-clicks).
- **Empty State:** N/A.
- **Validation Error State:** N/A.
- **Server Error State:** Missing. No `try/catch` wrapping `signOut()`. Failure results in silent failure or unhandled promise rejection.
- **Session Expired State:** N/A.

## 5. Onboarding (`/onboarding`)
- **Success State:** Progresses through steps, submits to API, shows `SuccessStep`, redirects to `/dashboard`.
- **Loading State:** Handled on the final `ReviewStep` via `isSubmitting`.
- **Empty State:** N/A.
- **Validation Error State:** Local state validation prevents progression to next steps if required fields are missing.
- **Server Error State:** Caught and displayed via `submitError` on the final step. *High Risk:* Health Plan Generation is synchronous within the transaction. If it fails, the entire profile creation rolls back.
- **Session Expired State:** Handled via SSR redirect.

## 6. Health Plan Generation (`actions.ts`)
- **Success State:** Plan generated and saved atomically with the profile.
- **Loading State:** Bundled into Onboarding's `isSubmitting` state.
- **Empty State:** N/A.
- **Validation Error State:** Zod parsing catches issues before LLM call.
- **Server Error State:** Caught by the transaction, but yields a generic "Failed to save" error.
- **Session Expired State:** Server Action rejects unauthorized users with a generic error object.

## 7. Dashboard (`/dashboard`)
- **Success State:** Renders health profile, current plan, and metrics.
- **Loading State:** Missing. Server-side data fetching blocks render. No `loading.tsx`.
- **Empty State:** Missing/Flawed. **CRITICAL RISK:** If a user has a `HealthProfile` but no `HealthPlan` (e.g., due to an AI generation failure in the past), `/dashboard` redirects them to `/onboarding`. But `/onboarding` sees the `HealthProfile` and redirects to `/dashboard`. This creates an **Infinite Redirect Loop**.
- **Validation Error State:** N/A.
- **Server Error State:** Missing `error.tsx`.
- **Session Expired State:** Redirects to `/login`.

## 8. Daily Check-ins (`TrackerGrid`)
- **Success State:** Value increments and synchronizes with server.
- **Loading State:** Handled beautifully via `useOptimistic` and `useTransition`.
- **Empty State:** Initialized properly to zero/target baseline.
- **Validation Error State:** Bound to static increment steps; no manual input vulnerability.
- **Server Error State:** **CRITICAL RISK:** The server action `updateDailyMetricAction` catches errors and returns `{ success: false }`. However, the UI entirely ignores the response. Optimistic UI stays visually updated, but on the next hard refresh, it reverts, causing severe user confusion.
- **Session Expired State:** Server Action rejects, UI ignores rejection.

## 9. Progress (`/dashboard/progress`)
- **Success State:** Renders weekly charts.
- **Loading State:** Missing. Blocks SSR.
- **Empty State:** Handled via custom empty state UI ("No data yet").
- **Validation Error State:** N/A.
- **Server Error State:** Missing `error.tsx`.
- **Session Expired State:** Redirects to `/login`.

## 10. Route Protection (Global)
- **Success State:** Allows access to `(protected)` routes.
- **Loading State:** N/A.
- **Empty State:** N/A.
- **Validation Error State:** N/A.
- **Server Error State:** Missing global boundary.
- **Session Expired State:** Next.js throws abrupt redirects without any toast/alert notifying the user *why* they were logged out.
