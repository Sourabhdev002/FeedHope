# Security Decision Log

**Date:** 2026-07-29

### 1. Zod Boundaries on Server Actions
- **Why it helps:** Prevents arbitrary or malicious data from reaching the database layer via Server Actions (which act as API endpoints).
- **Expected measurable benefit:** Eliminates the possibility of storing out-of-bounds metrics (e.g. -5000 steps) or executing DoS via massive strings.
- **Trade-offs:** Adds minor runtime parsing overhead (negligible) and requires strictly keeping the schema in sync with the client UI inputs.

### 2. Implementation of Security Headers
- **Why it helps:** Informs the browser to enable built-in protections against Clickjacking (`X-Frame-Options`), MIME-sniffing (`X-Content-Type-Options`), and forces HTTPS connections (`Strict-Transport-Security`).
- **Expected measurable benefit:** Immediate compliance with OWASP Top 10 basic security hygiene standards; neutralizes many client-side injection escalations.
- **Trade-offs:** If configured improperly, can block legitimate iframes or break subdomains if HSTS is applied too broadly. We will use standard, safe defaults.

### 3. NPM Overrides for Vulnerability Remediation
- **Why it helps:** Directly patches nested vulnerable packages (`postcss`, `sharp`, `brace-expansion`) without breaking top-level dependencies like Next.js that haven't formally updated their package constraints yet.
- **Expected measurable benefit:** 0 High Severity vulnerabilities reported by `npm audit`.
- **Trade-offs:** Potential for edge-case breaking changes deep in the dependency tree. 
