# Performance Optimisation Plan

**Date:** 2026-07-29

This document outlines the strategy for resolving the performance bottlenecks identified in the BR4 Audit.

## Implementation Phases

### Phase 1: Data Fetching Concurrency
1. **Refactor Dashboard Server Component (`dashboard/page.tsx`)**
   - Combine independent Prisma queries (e.g., `healthProfile` and `healthPlan`) using `Promise.all()`.
2. **Eliminate Duplicate Queries**
   - Update `getWeeklyProgress(userId)` to accept the `plan` object or its components as arguments rather than querying `prisma.healthPlan` a second time.

### Phase 2: Client Bundle Optimization
1. **Dynamic Imports in Onboarding (`OnboardingWizard.tsx`)**
   - Use `next/dynamic` to lazy-load the individual step components (`BasicInfoStep`, `LifestyleStep`, etc.).
   - This ensures the client only downloads the JavaScript for the specific step they are currently viewing, chunking the large 25kB bundle.

---

## Decision Log

### 1. Promise.all() for Prisma Queries
- **Why it helps:** Prevents the server from waiting for Query A to finish before starting Query B.
- **Expected measurable benefit:** ~40-50% reduction in database wait time on the `/dashboard` route (First Contentful Paint improvement).
- **Trade-offs:** Slightly higher peak concurrent database connections.

### 2. Passing `plan` to `getWeeklyProgress`
- **Why it helps:** Removes a redundant `findFirst` query against the database that was already performed higher up in the component tree.
- **Expected measurable benefit:** Eliminates 1 entire database round-trip (~20-50ms) per dashboard load.
- **Trade-offs:** Increases the coupling between the route handler and the domain function slightly by modifying its signature.

### 3. Dynamic Imports for Onboarding Steps
- **Why it helps:** Code-splits the heavy wizard component.
- **Expected measurable benefit:** ~50% reduction in the initial JS payload size for the `/onboarding` route.
- **Trade-offs:** Introduces microscopic layout shifts or loading states when transitioning between steps as the browser fetches the next chunk.

---

## Risk Assessment
- **Data Layer:** Refactoring to `Promise.all` is generally low risk, but if the queries have hidden dependencies (they do not in our case), it could cause race conditions. 
- **Client Bundles:** `next/dynamic` may introduce brief visual flashes between steps if the network is extremely slow. We will mitigate this with preloading if necessary.

## Rollback Strategy
- All optimizations are highly localized. If the data fetching refactor fails, we can revert `dashboard/page.tsx` and `get-weekly-progress.ts` directly from source control without affecting database integrity.
- If dynamic imports cause UX issues, they can be reverted to static imports in `OnboardingWizard.tsx` with a single line change per component.

## QA Checklist
- [ ] Measure TTFB (Time to First Byte) on `/dashboard` before and after data layer changes.
- [ ] Verify `getWeeklyProgress` still correctly calculates percentages and active days.
- [ ] Inspect the network tab on `/onboarding` to confirm JS chunks are loaded incrementally rather than all at once.

## Acceptance Criteria
- `/dashboard` contains zero sequential database query waterfalls for independent data.
- Duplicate `healthPlan` queries are eliminated.
- `/onboarding` initial JS bundle size is reduced by utilizing code-splitting.
