# Database Design

## Entity Relationship Diagram (Mental Model)
```
User 1 -- 1 Profile
User 1 -- 1 Assessment
User 1 -- 1 Health_Plan
Health_Plan 1 -- * Habit
User 1 -- * Log
Habit 1 -- * Log
User 1 -- 1 Subscription
```

## Tables

### `users`
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### `profiles`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key, Unique)
- `full_name` (String)
- `timezone` (String)
- `preferences` (JSON)

### `assessments`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key, Unique)
- `responses` (JSON)
- `completed_at` (Timestamp)

### `health_plans`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key, Unique)
- `status` (Enum: 'active', 'completed')
- `created_at` (Timestamp)

### `habits`
- `id` (UUID, Primary Key)
- `health_plan_id` (UUID, Foreign Key)
- `title` (String)
- `description` (Text, Optional)
- `frequency` (JSON: e.g., `{ type: 'daily', days: [1,2,3,4,5] }`)
- `status` (Enum: 'active', 'archived')
- `created_at` (Timestamp)

### `logs`
- `id` (UUID, Primary Key)
- `habit_id` (UUID, Foreign Key)
- `user_id` (UUID, Foreign Key)
- `completed_at` (Timestamp)
- `status` (Enum: 'completed', 'skipped', 'failed')
- `notes` (Text, Optional)

### `subscriptions`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key, Unique)
- `stripe_customer_id` (String)
- `status` (Enum: 'active', 'past_due', 'canceled', 'trialing')
- `plan_tier` (Enum: 'free', 'premium')
- `current_period_end` (Timestamp)

## Relationships
- A `User` has one `Profile`, `Assessment`, `Health_Plan`, and `Subscription`.
- A `Health_Plan` has many `Habits`.
- A `Habit` has many `Logs`.
- A `User` has many `Logs`.

## Index Strategy
- **Primary Keys:** Clustered indexes on all `id` fields.
- **Foreign Keys:** Non-clustered indexes on `user_id` across tables and `health_plan_id` in `habits` for fast lookups.
- **Temporal Queries:** Index on `logs.completed_at` and `logs.user_id` combined to quickly fetch a user's progress for a given week/month.

## Future Scalability
- **Partitioning:** The `logs` table will grow rapidly. Plan to partition this table by month or quarter as data volume exceeds 10M rows.
- **Read Replicas:** Use read replicas for analytical queries and reporting to prevent locking on the primary transactional database.
