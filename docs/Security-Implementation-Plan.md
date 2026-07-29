# Security Implementation Plan

**Date:** 2026-07-29

## Implementation Phases

### Phase 1: Input Validation Hardening
1. Add `zod` schemas to `src/features/daily-checkin/application/actions.ts`.
2. Validate `value` parameter in `updateDailyMetricAction` to prevent negative numbers, excessively large numbers, and non-numeric payloads.
3. Validate `habitName` parameter in `toggleHabitAction` to enforce string length limits.

### Phase 2: HTTP Security Headers
1. Modify `next.config.ts` to inject an array of recommended security headers on all routes.
2. Headers to include: 
   - `X-DNS-Prefetch-Control`
   - `Strict-Transport-Security` (HSTS)
   - `X-Frame-Options` (DENY/SAMEORIGIN)
   - `X-Content-Type-Options` (nosniff)
   - `Referrer-Policy`

### Phase 3: Dependency Remediation
1. Update `package.json` with an `overrides` section to force patched versions of the vulnerable dependencies identified by `npm audit` (`postcss`, `sharp`, `brace-expansion`).
2. Run `npm install` to update the package-lock tree without inadvertently upgrading Next.js or other core libraries.

---

## Risk Assessment
- **Validation Changes:** Low risk. Genuine client usage naturally adheres to the new limits. Only malicious or corrupted payloads will be blocked.
- **Security Headers:** Medium risk. Incorrect framing headers might block internal iframes (though FeedHope currently does not use iframes). Strict HSTS must be treated carefully in local development.
- **Dependency Overrides:** Medium risk. Forcing a dependency version deep in the tree may theoretically introduce incompatibilities with the parent library (e.g., Next.js), though security patches rarely introduce breaking API changes.

## Rollback Strategy
- **Code Changes:** Revert `actions.ts` and `next.config.ts` via Git if any UI breaks or if the build fails.
- **Dependencies:** Remove the `overrides` block in `package.json` and run `npm install` to revert to the previous dependency lock state.

## QA Checklist
- [ ] Attempt to manually POST negative numbers to the server action endpoints and verify rejection.
- [ ] Inspect HTTP response headers in the browser dev tools to confirm presence of `X-Frame-Options` and `Strict-Transport-Security`.
- [ ] Verify `npm audit` returns 0 vulnerabilities after applying overrides.

## Acceptance Criteria
- Server actions are strictly typed and runtime-validated with Zod boundaries.
- All pages respond with industry-standard security headers.
- The npm dependency tree is free of high-severity vulnerabilities without breaking the build.
