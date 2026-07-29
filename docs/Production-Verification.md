# Production Verification Checklist

To execute this verification plan, an actual deployment instance is required.

## 1. Environment Variables Validation
- [ ] Ensure `DATABASE_URL` is populated and reaches the Neon instance.
- [ ] Ensure `BETTER_AUTH_SECRET` is a 32-byte secure hash.
- [ ] Ensure `BETTER_AUTH_URL` identically matches the public domain.

## 2. Infrastructure Connectivity
- [ ] **Database**: Verify data can be written (run Registration flow).
- [ ] **Auth**: Verify cookies are correctly configured and cross-origin issues are non-existent.
- [ ] **PostHog**: Log into PostHog Live Events view and trigger a `$pageview` by loading the live app. Ensure the host is recognized.

## 3. Security
- [ ] Run a curl check on the headers:
  ```bash
  curl -I https://app.feedhope.com
  ```
  Ensure `Strict-Transport-Security`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` are present.

## 4. End-to-End E2E Tests (Playwright)
Once deployed to a staging or beta domain, run the `smoke-test.js` script pointing `baseUrl` to the live domain.
```bash
node smoke-test.js
```
The test should yield all green checkmarks without timeouts.
