# Error State Catalog

**Date:** 2026-07-29

This catalog details the specific error identities, user-facing messaging, and recovery actions for FeedHope's resilience upgrade.

| Error ID | Description | User Message | Recovery Action | Developer Notes |
| :--- | :--- | :--- | :--- | :--- |
| **`ERR_GLOBAL_BOUNDARY`** | Unhandled top-level React exceptions or Next.js routing failures. | "Something went wrong on our end." | Render a "Try again" button that calls Next.js `reset()` to attempt a re-render. | Implemented via a root-level `error.tsx` boundary to prevent white screens of death. |
| **`ERR_SESSION_EXPIRED`** | The session token has expired or is invalid. | "Your session has expired. Please sign in again." | Redirect to `/login` and optionally store the intended URL in a `?callbackUrl` parameter. | Implement via global route middleware or higher-order protection functions instead of scattered `redirect()` calls. |
| **`ERR_AUTH_REJECTED`** | Invalid credentials or registration conflict (e.g. email exists). | "Invalid email or password." / "Email already in use." | Keep user on the form, clear the password field, and highlight the error. | Handled locally via `ErrorBanner` inside `(auth)` components. |
| **`ERR_PLAN_GEN_FAILED`** | AI generation fails synchronously during onboarding. | "We created your profile, but health plan generation timed out. Please retry." | Save the `HealthProfile`, redirect the user to a "Generating Plan..." screen, and allow manual retry. | Requires detaching plan generation from the strict Prisma transaction in `submitAssessmentAction`. |
| **`ERR_MISSING_PLAN_LOOP`** | User has a `HealthProfile` but no active `HealthPlan`. | N/A (System State Error) | Redirect the user to a `/dashboard/setup` or explicit loading page instead of bouncing back to `/onboarding`. | Fix the Dashboard & Onboarding infinite redirect collision. |
| **`ERR_METRIC_UPDATE`** | `updateDailyMetricAction` fails during a TrackerGrid optimistic update. | "Failed to sync your progress. Please check your connection." | Revert the optimistic state visually and show a toast notification. | UI must check the returned `{ success: boolean }` from the server action and rollback on `false`. |
| **`ERR_LOGOUT_FAILED`** | Network or server error during `signOut()`. | "Failed to sign out securely. Please refresh and try again." | Re-enable the logout button and show a toast error. | Needs a `try/catch` and an `isLoggingOut` state in `LogoutButton.tsx`. |
