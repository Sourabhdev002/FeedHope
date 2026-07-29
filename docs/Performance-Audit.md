# Performance Audit

**Date:** 2026-07-29

## 1. Bundle Size
**Findings:**
- The `/onboarding` route has the largest First Load JS payload (~25kB for the chunk, ~127kB total). This is because the `OnboardingWizard` is a monolithic Client Component that statically imports all 6 steps (`WelcomeStep`, `BasicInfoStep`, etc.) at once.
- `lucide-react` is used extensively. Fortunately, Next.js handles tree-shaking for this by default, so it's not bloating the shared bundle, but could still be optimized if loaded dynamically in non-critical paths.
- **Severity:** Medium
- **Expected Impact:** Slower Time-to-Interactive (TTI) on mobile devices for the onboarding flow.
- **Recommended Fix:** Implement `next/dynamic` to lazy-load the individual onboarding steps so only the active step is downloaded by the client.
- **Implementation Effort:** Low

## 2. Rendering
**Findings:**
- Server Components are utilized well for static pages like the Landing page. 
- However, the `/dashboard` route lacks a `<Suspense>` boundary. It fetches all data on the server before emitting any HTML, meaning the user stares at the global loading spinner (or nothing) until all queries finish.
- **Severity:** High
- **Expected Impact:** Increased First Contentful Paint (FCP) and perceived latency on the Dashboard.
- **Recommended Fix:** Wrap independent dashboard sections (like `HabitTracker` and `getWeeklyProgress`) in `<Suspense>` boundaries and stream them in.
- **Implementation Effort:** Medium

## 3. Data Layer
**Findings:**
- **Duplicate Queries:** `DashboardPage` fetches `healthPlan` from Prisma. It then calls `getWeeklyProgress(session.user.id)`. Inside `getWeeklyProgress`, the system performs another `prisma.healthPlan.findFirst()` query.
- **Query Waterfalling:** In `DashboardPage`, `healthProfile`, `healthPlan`, `dailyCheckIn`, and `getWeeklyProgress` are `await`ed sequentially. This forces the server to wait for each query to complete before starting the next.
- **Severity:** High
- **Expected Impact:** Database latency is multiplied. A 50ms query becomes a 200ms+ delay.
- **Recommended Fix:** 
  1. Pass the `healthPlan` directly into `getWeeklyProgress` to eliminate the duplicate query.
  2. Use `Promise.all()` to execute independent Prisma queries (e.g., fetching `healthProfile` and `healthPlan`) concurrently.
- **Implementation Effort:** Medium

## 4. Assets
**Findings:**
- Fonts are correctly optimized using `next/font/google`.
- Icons are lightweight SVGs via `lucide-react`.
- There are no heavy images or unoptimized `<img />` tags weighing down the application.
- **Severity:** Low
- **Expected Impact:** Minimal.
- **Recommended Fix:** N/A. The asset pipeline is currently healthy.
- **Implementation Effort:** None

## 5. Next.js Features
**Findings:**
- `next/dynamic` is underutilized (as noted in Bundle Size).
- The Dashboard route opts into dynamic rendering via `headers()` for authentication, which is correct, but prevents Static Route caching. 
- **Severity:** Medium
- **Expected Impact:** Server load increases linearly with users since the dashboard can't be cached.
- **Recommended Fix:** Leverage React Cache (`cache()`) for shared data fetching utilities, and utilize Partial Prerendering (PPR) or Suspense streaming to mitigate the dynamic route penalty.
- **Implementation Effort:** Low-Medium

## 6. Simulated Lighthouse Review
- **Performance (Estimate: 85/100):** Hampered primarily by the sequential data fetching waterfall on the dashboard.
- **Accessibility (Estimate: 95/100):** Good semantic HTML and contrast, though a few icons might lack strict `aria-hidden`.
- **Best Practices (Estimate: 95/100):** No deprecated APIs or console errors detected.
- **SEO (Estimate: 100/100):** Landing page has proper `metadata` exports, semantic hierarchy, and is statically prerendered.
