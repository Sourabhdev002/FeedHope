# Infrastructure Setup Guide

This guide details the step-by-step setup of the production stack for FeedHope.

## Target Stack
- **Frontend & Edge Hosting**: Vercel
- **Database**: Neon (Serverless PostgreSQL)
- **ORM**: Prisma (with `@prisma/adapter-pg` for Edge compatibility)
- **Auth**: Better Auth
- **Analytics**: PostHog
- **DNS & CDN**: Cloudflare

## 1. Database Setup (Neon PostgreSQL)
1. Create a project in [Neon](https://neon.tech).
2. Note the generated Postgres connection string.
3. In Neon Settings, navigate to **Connection Details** and enable **Pooled connection** if you are deploying to Vercel Serverless/Edge functions, although we are using direct connections in our `.env` configuration. Ensure you retrieve the standard direct connection string for Prisma migrations.

## 2. Vercel Project Setup
1. Import the FeedHope Git repository into Vercel.
2. In the Vercel dashboard, override the framework preset to **Next.js**.
3. **Environment Variables**:
   - `DATABASE_URL`: Your Neon Postgres connection string.
   - `BETTER_AUTH_SECRET`: A secure 32-byte string (generate using `openssl rand -base64 32`).
   - `BETTER_AUTH_URL`: Your exact production domain (e.g., `https://app.feedhope.com`).
   - `NEXT_PUBLIC_APP_URL`: Your production domain.
   - `NEXT_PUBLIC_POSTHOG_KEY`: Your PostHog Project API Key.
   - `NEXT_PUBLIC_POSTHOG_HOST`: `https://us.i.posthog.com` (or EU equivalent).

## 3. Cloudflare DNS Setup
1. Add your root domain to Cloudflare.
2. In Vercel, go to Settings -> Domains and add `app.feedhope.com`.
3. Vercel will provide CNAME records. Add these CNAME records to Cloudflare DNS.
4. Keep the proxy status to **DNS Only** (grey cloud) initially to allow Vercel to provision Let's Encrypt certificates.

## 4. Analytics Setup (PostHog)
1. Create a project in PostHog.
2. Ensure you retrieve the Project API Key (starts with `phc_`).
3. (Optional) Configure a custom proxy in Next.js rewrites to bypass adblockers.
