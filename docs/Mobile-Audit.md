# Mobile Audit: FeedHope Experience

**Date:** 2026-07-29
**Tested Breakpoints:** 320px, 375px, 390px, 414px, 768px

This document summarizes the UX issues discovered during the mobile layout audit across key screens. Most issues occur at the extreme `320px` viewport, where hardcoded padding and multi-column grids squeeze content uncomfortably. At `375px` and above, the app performs beautifully.

## 1. Landing Page (`/`)

- **UX Issue:** The header navigation buttons ("Sign in" and "Get started") wrap and are squished at 320px. The tight `gap-4` and padding on the CTA button push the text into a narrow column.
- **Severity:** Medium
- **Recommended Fix:** 
  - Change the header navigation gap to `gap-2 sm:gap-4`.
  - Reduce the padding on the "Get started" button for small viewports: `px-3 py-1.5 sm:px-4 sm:py-2`.
- **Implementation Order:** 5

## 2. Login & Register (`/login`, `/register`)

- **UX Issue:** The authentication `FormCard` uses a static `px-8 py-8` padding. On 320px devices (which leaves only 288px width for the card), this leaves a meager 224px for the form fields and text. The "Don't have an account?" text wraps awkwardly. On the Register page, the First Name and Last Name fields are placed in a static `grid-cols-2` layout, leaving only ~106px for each input, truncating placeholders.
- **Severity:** High
- **Recommended Fix:** 
  - Make `FormCard` padding responsive: `px-5 py-6 sm:px-8 sm:py-8`.
  - Change the Register form's name row to stack on small screens: `grid-cols-1 sm:grid-cols-2`.
- **Implementation Order:** 1

## 3. Dashboard: Tracker Grid (`/dashboard`)

- **UX Issue:** The `TrackerGrid` uses a strict `grid-cols-2` layout. At 320px, each card is around 128px wide. With `p-5` padding, only 88px remains for content. Action buttons (e.g., "+250ml", "+30m") are compressed to ~40px wide each, causing text overflow or cramped touch targets.
- **Severity:** High
- **Recommended Fix:** 
  - Reduce padding on the inner cards on small screens: `p-3 sm:p-5`.
  - Adjust action button gap and padding: `gap-1 sm:gap-2`, `py-1 sm:py-1.5`.
  - Scale down metric target typography: `text-xs sm:text-sm` for the target labels.
- **Implementation Order:** 2

## 4. Dashboard: Extras Row (`/dashboard`)

- **UX Issue:** The "Daily Motivation" and "Habits" / "Active Days" cards are placed in a strict `grid-cols-2` layout. At 320px, the Motivation card text ("Small steps every day...") wraps too much, and the title feels cramped.
- **Severity:** Medium
- **Recommended Fix:** 
  - Change the grid layout to stack vertically on extremely small screens: `flex flex-col sm:grid sm:grid-cols-2` or `grid-cols-1 sm:grid-cols-2`.
- **Implementation Order:** 3

## 5. Onboarding (`/onboarding`)

- **UX Issue:** The `OnboardingWizard` main card uses `px-6` padding. It is adequate, but for 320px devices, maximizing the horizontal space for form inputs could improve readability, especially for the "Health Conditions" multi-select step.
- **Severity:** Low
- **Recommended Fix:** 
  - Make the card padding responsive: `px-4 sm:px-8`.
- **Implementation Order:** 6

## 6. Progress Dashboard (`/dashboard/progress`)

- **UX Issue:** While the outer layout scales well, nested grids within the `ProgressDashboard` (like stats summaries) will encounter the same 320px squishing issues as the `TrackerGrid` if they use fixed 2-column or 3-column layouts.
- **Severity:** Medium
- **Recommended Fix:** 
  - Ensure all stat blocks and charts use responsive grid classes (`grid-cols-1 sm:grid-cols-2`).
- **Implementation Order:** 4

---

### Conclusion

The primary issue across the FeedHope mobile experience is the assumption of a `375px` or wider viewport in grid layouts and padding. By introducing `sm:` breakpoint overrides and reducing base padding for the `320px` edge case, the app will achieve true mobile excellence without affecting larger devices.
