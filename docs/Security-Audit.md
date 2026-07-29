# Security Audit

**Date:** 2026-07-29

## 1. Authentication
**Findings:** 
- `better-auth` manages sessions robustly. 
- Middleware correctly guards `/dashboard` and `/onboarding`, redirecting unauthenticated users to `/login`.
- **Status:** PASS (No immediate action required)

## 2. Authorisation (Ownership & IDOR)
**Findings:** 
- All Server Actions (e.g., `getOrCreateTodayCheckIn`, `submitAssessmentAction`) correctly extract `userId` from the server-validated `session` object rather than relying on client-provided IDs. This inherently prevents Insecure Direct Object Reference (IDOR) vulnerabilities where a user could modify someone else's data.
- **Status:** PASS (No immediate action required)

## 3. Input Validation
**Findings:** 
- `submitAssessmentAction` uses `zod` effectively.
- **VULNERABILITY:** `updateDailyMetricAction` and `toggleHabitAction` in `daily-checkin` do not validate their inputs. A malicious actor could bypass the client UI and send a POST request with `value: -10000` (negative steps) or `value: NaN`, polluting the database. `habitName` could be an excessively large string causing DoS.
- **Severity:** Medium/High
- **Risk:** Database corruption, logic bypass, potential DoS.
- **Recommended Fix:** Implement `zod` schemas for the daily check-in actions to enforce strict boundaries (e.g., `z.number().min(0).max(100000)`, `z.string().max(100)`).

## 4. Database
**Findings:** 
- Prisma ORM is utilized for all database interactions. No `$executeRaw` or `$queryRaw` calls exist in the application code, mitigating SQL injection risks entirely.
- Transactions are appropriately used for multi-step mutations (e.g., profile creation).
- **Status:** PASS (No immediate action required)

## 5. Secrets
**Findings:** 
- Environment variables are securely defined. Sensitive variables (like `BETTER_AUTH_SECRET` and `DATABASE_URL`) are not exposed to the client via `NEXT_PUBLIC_` prefixes.
- **Status:** PASS (No immediate action required)

## 6. HTTP Security
**Findings:** 
- **VULNERABILITY:** The application lacks HTTP Security Headers. Next.js does not apply strict headers (like Strict-Transport-Security, X-Frame-Options, or Content-Security-Policy) by default.
- **Severity:** Medium
- **Risk:** Susceptibility to Clickjacking, MIME-type sniffing, and Cross-Site Scripting (XSS) escalations.
- **Recommended Fix:** Inject a comprehensive array of security headers in `next.config.ts`.

## 7. Dependencies
**Findings:** 
- **VULNERABILITY:** `npm audit` reports 12 High Severity vulnerabilities originating from nested dependencies (`postcss`, `sharp`, `brace-expansion`).
- **Severity:** High
- **Risk:** Vulnerability to ReDoS (Regular Expression Denial of Service), path traversal, and image processing exploits (via sharp).
- **Recommended Fix:** Update the vulnerable packages via `npm overrides` in `package.json` to force safe versions without unintentionally bumping Next.js to an incompatible major version.
