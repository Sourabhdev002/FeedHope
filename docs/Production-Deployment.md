# Production Deployment Guide

## Pre-Deployment Steps

1. **Prisma Migrations**:
   Add a pre-build step in Vercel to run database migrations automatically upon deploy.
   Update `package.json` scripts:
   ```json
   "scripts": {
     "postinstall": "prisma generate",
     "build": "prisma migrate deploy && next build"
   }
   ```

2. **Vercel Build Configuration**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`

## Deployment Lifecycle

1. A push to the `main` branch triggers a Vercel deployment.
2. Vercel provisions a clean build container, installs dependencies, and runs `prisma generate`.
3. The build script executes `prisma migrate deploy`, pushing any pending schema changes to the Neon PostgreSQL database.
4. Next.js compiles the production build.
5. Vercel routes traffic to the new Edge deployment upon success.

## Rollback Procedure
If a critical failure occurs post-deployment:
1. In Vercel, navigate to the **Deployments** tab.
2. Locate the previous successful deployment and click **Promote to Production** (or **Redeploy**).
3. If the database schema was heavily mutated and caused the breakage, you must manually connect to the database or run a `down` migration via Prisma before reverting the codebase, as Vercel instant rollbacks do not roll back external database state.
