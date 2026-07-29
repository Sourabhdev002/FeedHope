# API Specification

## Protocol
RESTful JSON API (or tRPC/GraphQL depending on final stack choice). Below represents the REST specification.

## Authentication
All endpoints (except `/auth/*` and webhooks) require a Bearer token in the Authorization header.
`Authorization: Bearer <JWT_TOKEN>`

## Error Handling
Standardized error response format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      { "field": "email", "message": "Must be a valid email address" }
    ]
  }
}
```

## REST Endpoints (Core MVP)

### Authentication & Profile
- `GET /api/v1/auth/session`
  - Validates current session token.
- `GET /api/v1/profile`
  - Returns current user profile and subscription status.
- `PATCH /api/v1/profile`
  - Updates user preferences and personal details.

### Health Assessment
- `POST /api/v1/assessment`
  - Submits the initial health assessment questionnaire.
- `GET /api/v1/assessment`
  - Retrieves the user's completed assessment data.

### Health Plan & Habits
- `GET /api/v1/health-plan`
  - Retrieves the current personalised health plan and associated habits.
- `POST /api/v1/health-plan/generate`
  - Generates a new health plan based on assessment data.
- `GET /api/v1/habits`
  - Returns a list of active habits for the user's dashboard.
- `PATCH /api/v1/habits/{id}`
  - Updates habit details (e.g., frequency, reminders).

### Dashboard & Logs
- `POST /api/v1/logs`
  - Logs a habit completion for the dashboard.
  - **Request Example:**
    ```json
    {
      "habit_id": "uuid-1234",
      "status": "completed",
      "completed_at": "2024-07-28T08:00:00Z"
    }
    ```
- `GET /api/v1/logs?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
  - Retrieves logs for a specific time range for dashboard rendering.

### Subscription
- `GET /api/v1/subscription`
  - Retrieves current subscription tier and billing cycle.
- `POST /api/v1/subscription/checkout`
  - Generates a Stripe checkout session URL.
