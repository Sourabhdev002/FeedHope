# Analytics Implementation Plan

**Date:** 2026-07-29

## Implementation Phases

### Phase 1: SDK Integration
1. Install `posthog-js` via npm.
2. Create a PostHog Provider wrapper component (`PostHogProvider.tsx`) for the Next.js `app` directory.
3. Wrap the root `layout.tsx` with the provider, initializing it with `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.
4. Configure PostHog to run in "cookie-less" or "memory" mode by default to ensure maximum privacy compliance.

### Phase 2: Core Event Instrumentation
1. **Authentication:** Instrument `/login` and `/register` Server Actions or client callbacks to emit `login_success`, `login_failed`, and `user_registered`.
2. **Onboarding:** Add `onboarding_started` on mount of the `WelcomeStep` and `onboarding_completed` upon successful submission of the wizard. Track `health_plan_generated` in the AI generation callback.
3. **Dashboard:** Add `dashboard_viewed` tracking.
4. **Interactions:** Instrument the `TrackerGrid` to emit `daily_checkin_started` and `habit_completed`. Add logic to detect 100% completion for `daily_checkin_completed`.

### Phase 3: Identity & Session Linking
1. After successful login or registration, call `posthog.identify(userId)` using the anonymous UUID (not the email) to stitch pre-auth and post-auth sessions together.
2. Call `posthog.reset()` upon logout to sever the analytics session securely.

---

## Risk Assessment
- **Bundle Size:** Adding an analytics SDK increases the client payload. *Mitigation:* We will lazy-load the PostHog provider and ensure it executes non-blockingly.
- **Privacy Compliance:** Accidental ingestion of PII (e.g. typing an email into a wrong field being captured by session replay). *Mitigation:* We will aggressively use PostHog's privacy masks (`ph-no-capture` CSS classes) on input fields and sensitive DOM elements.
- **Ad Blockers:** Client-side tracking is frequently blocked. *Mitigation:* Acceptable trade-off for an early startup. We will not use complex reverse-proxies for now, accepting a ~15-20% margin of error in data capture.

## Privacy Considerations
- No names, emails, or exact birth dates will be sent as event properties.
- We will rely exclusively on the anonymized database UUID as the `distinct_id`.
- PostHog will be configured to disable auto-capturing of sensitive input fields by default.

## Rollback Strategy
- If the SDK causes client crashes or massive performance degradation, we will remove the `PostHogProvider` from `layout.tsx`. Because all subsequent `posthog.capture()` calls fail silently when the provider is missing, this single removal effectively disables analytics globally without breaking the app.

## QA Checklist
- [ ] Verify `posthog-js` is correctly loaded in the browser network tab.
- [ ] Confirm no cookies are set by PostHog before explicit consent (or verify memory persistence mode).
- [ ] Click through the onboarding funnel and verify `onboarding_started` and `onboarding_completed` appear in the PostHog Live Events tail.
- [ ] Log in and verify `posthog.identify()` is called with a UUID, not an email.
- [ ] Type into the onboarding input fields and verify session replay redacts the keystrokes.

## Acceptance Criteria
- PostHog SDK is integrated and capturing pageviews automatically.
- All 13 core events defined in `Event-Taxonomy.md` are actively firing in their respective user flows.
- User privacy is mathematically guaranteed by the absence of PII in the event payloads.
