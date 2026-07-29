# FeedHope Database Architecture (M3)

## 1. Overview
This document outlines the initial database architecture for the FeedHope MVP. The design strictly adheres to the Domain-Driven Design (DDD) principles defined in `Domain-Model.md`. The database leverages PostgreSQL and is accessed exclusively via Prisma ORM v7.

## 2. Global Conventions
To ensure the schema remains clean, scalable, and predictable, the following conventions are applied:
- **Primary Keys**: UUIDs (`@default(uuid())`) are used for all primary keys to ensure globally unique identifiers and simplify future data migrations or distributed architectures.
- **Timestamps**: All tables include `createdAt` and `updatedAt` timestamps managed in UTC by Prisma (`@default(now())` and `@updatedAt`).
- **Dates**: Dates without times (e.g., `checkInDate`) use `@db.Date` to strip timezone offsets.
- **Naming Conventions**: 
  - PascalCase for Models (`HealthProfile`).
  - camelCase for fields and relations (`healthProfileId`).
  - UPPERCASE for Enum values (`FREE`, `PREMIUM`).

## 3. Data Integrity & Cascade Behavior
- **Foreign Keys**: Strict foreign key constraints enforce domain relationships.
- **Cascade Deletes**: Deleting an Aggregate Root (e.g., `User`) cascades down to its owned entities (e.g., `HealthProfile`, `HealthPlan`, `Subscription`) to prevent orphaned records.
- **Unique Constraints**: Used to enforce domain rules (e.g., a `User` has a single `HealthProfile`; a user can only have one `DailyCheckIn` per `HealthPlan` per day).

## 4. Enum Strategy
Enums are used to enforce strict types at the database level where state domains are limited and well-known.
- `SubscriptionTier`: `FREE`, `PREMIUM`.
- `SubscriptionStatus`: `ACTIVE`, `CANCELED`, `EXPIRED`.
*(Note: We use native PostgreSQL enums via Prisma rather than lookup tables for simplicity and performance during the MVP).*

## 5. Audit Field Strategy & Soft Deletion
- **Audit**: Basic auditing is achieved via `createdAt` and `updatedAt`.
- **Soft Deletion**: For the MVP, hard deletes (via Cascade) are used to keep the schema simple and avoid premature optimization. Soft deletes (e.g., `deletedAt`) will only be introduced for financial records or health data that requires compliance retention in future milestones.

## 6. Future Migration Strategy
- **Prisma Migrate**: All schema changes will be managed via `prisma migrate dev`.
- **No Backward Incompatibility**: Column drops or renames must be executed in multi-step migrations to guarantee zero-downtime deployments as the platform scales.

## 7. MVP Schema Models

### User (Aggregate Root)
The core identity of a person interacting with FeedHope.
- **Fields**: `id`, `email`, `passwordHash`, `firstName`, `lastName`.
- **Relationships**: `HealthProfile` (1:1), `HealthPlan` (1:N), `Subscription` (1:N).

### HealthProfile (Aggregate)
Physical characteristics and baseline identity.
- **Fields**: `id`, `userId`, `dateOfBirth`, `gender`, `heightCm`, `weightKg`.
- **Relationships**: Belongs to `User`, owns `HealthAssessment` (1:N).

### HealthAssessment (Entity)
A snapshot evaluating a user's health at a point in time.
- **Fields**: `id`, `healthProfileId`, `assessmentDate`, `overallScore`, `notes`.
- **Relationships**: Belongs to `HealthProfile`.

### HealthPlan (Aggregate)
The personalized, actionable roadmap for a user.
- **Fields**: `id`, `userId`, `title`, `description`, `startDate`, `endDate`, `isActive`.
- **Relationships**: Belongs to `User`, owns `DailyCheckIn` (1:N).

### DailyCheckIn (Entity)
A log entry detailing adherence to a Health Plan.
- **Fields**: `id`, `healthPlanId`, `checkInDate`, `isCompleted`, `notes`.
- **Constraints**: Unique compound index on `[healthPlanId, checkInDate]`.
- **Relationships**: Belongs to `HealthPlan`.

### Subscription (Aggregate)
Manages billing tier and commercial state.
- **Fields**: `id`, `userId`, `tier`, `status`, `startDate`, `endDate`.
- **Relationships**: Belongs to `User`.
