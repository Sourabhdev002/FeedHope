# Authentication System Walkthrough (M4)

## Architecture Overview
The authentication system for FeedHope MVP is powered by **Better Auth**, integrated tightly with Next.js 15 (App Router) and Prisma v7. We designed this to adhere to Clean Architecture and Feature-based folder structures.

### Infrastructure (`src/features/auth/infrastructure`)
- **`better-auth.ts`**: Configures the server-side `betterAuth` instance with the Prisma Adapter and the Email/Password plugin. It strictly maps to our database via `@prisma/adapter-pg`.
- **`auth-client.ts`**: Configures the frontend `createAuthClient` with strong typing derived directly from the server configuration.

### Application (`src/features/auth/application`)
- **`auth-utils.ts`**: Provides `getServerSession()` for fetching the authenticated session natively within Next.js Server Components.

### Presentation (`src/features/auth/presentation`)
- **`LogoutButton.tsx`**: A reusable client component managing the sign-out flow and subsequent routing.

### UI Routes
- **`/register`**: A comprehensive registration form passing email, password, and custom fields (`firstName`, `lastName`) securely.
- **`/login`**: Handles credential validation and session instantiation.
- **`/dashboard`**: A server-rendered protected route that conditionally grants access based on session state and displays contextual session data.

### Middleware (`src/middleware.ts`)
We utilize Next.js Edge Middleware powered by `@better-fetch/fetch` to intercept unauthenticated requests heading towards `/dashboard` or other protected spaces, immediately redirecting them to `/login` without invoking heavy server rendering.

## Database (Prisma) Changes
- Added **`Session`**, **`Account`**, and **`Verification`** models.
- Updated **`User`** model: Removed manual `passwordHash` (delegated to Better Auth `Account` mapping). Added `name`, `emailVerified`, and `image`.

## Security Features
- **Password Hashing**: Offloaded internally to Better Auth (uses Argon2 natively). Passwords are never stored in plain text.
- **Session Tokens**: Handled automatically in HTTP-only cookies via the Better Auth API.
- **Duplicate Prevention**: Email uniqueness is enforced at the database level (`@unique` index).

## How to Test
1. Start the dev server: `npm run dev`.
2. Navigate to `/register`, fill out the details.
3. Observe you are redirected to `/dashboard` upon success.
4. Refresh `/dashboard` to confirm session persistence.
5. Click "Sign Out". You will be redirected to `/login`.
6. Manually navigate to `/dashboard` and confirm Edge middleware bounces you back to `/login`.
