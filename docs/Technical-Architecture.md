# Technical Architecture

## High-Level Architecture
FeedHope – Personal Health Platform follows a modern, scalable, cloud-native architecture using a decoupled frontend and backend.
- **Client Tier:** React Native (Mobile iOS/Android) and Next.js (Web Admin/Dashboard).
- **API Gateway/BFF:** RESTful API Gateway handling request routing, rate limiting, and aggregation.
- **Compute Tier:** Containerized microservices/serverless functions handling business logic and health plan generation.
- **Data Tier:** Managed PostgreSQL for relational data, Redis for caching/sessions.

## Feature-Based Folder Structure (Frontend Example)
```
/src
  /app                # Next.js App Router (or React Native Navigation)
  /features           # Feature-driven architecture
    /auth             # Authentication logic, components, APIs
    /assessment       # Health assessment flows
    /health-plan      # Personalised plan generation and logic
    /dashboard        # Habit tracking, visualisations, daily checklist
    /profile          # User settings and profile management
    /subscription     # Billing, paywalls
  /shared             # Reusable UI components, hooks, utils
    /components       # Buttons, Cards, Inputs
    /lib              # API clients
    /theme            # Design tokens
```

## Technology Stack
- **Frontend (Web):** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion.
- **Frontend (Mobile):** React Native (Expo).
- **Backend:** Node.js / NestJS (or Go for high-performance services).
- **Database:** PostgreSQL (Primary DB, managed via Supabase or AWS RDS), Prisma ORM.
- **Caching:** Redis (Upstash or AWS ElastiCache).
- **Infrastructure:** AWS or Vercel (Frontend), Railway/Render (Backend compute).

## Authentication Strategy
- **Provider:** Clerk, Supabase Auth, or Auth0.
- **Methods:** Social Login (Google, Apple) and Passwordless (Magic Link / OTP).
- **Tokens:** JWT-based stateless authentication, short-lived access tokens, secure HttpOnly refresh tokens for web.

## Payment Architecture
- **Provider:** Stripe Billing (Web) & RevenueCat (Mobile App Stores).
- **Flow:** Webhooks trigger backend state changes (e.g., `customer.subscription.updated`) which update the user's tier in PostgreSQL.
- **Tiers:** Free Tier (limited tracking, basic assessment), Premium (advanced health plan, deep analytics).

## Deployment Strategy
- **CI/CD:** GitHub Actions. Automated testing on PRs.
- **Environments:** Development, Staging, Production.
- **Infrastructure as Code (IaC):** Terraform or Pulumi for managing AWS resources.
- **Monitoring:** Datadog or Sentry for error tracking, Vercel Analytics for web performance.
