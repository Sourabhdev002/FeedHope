# Event Taxonomy

This document outlines the core product events that will be tracked within FeedHope to measure user engagement, product health, and funnel conversion.

## Core Events

| Event Name | Trigger | Properties | Business Purpose |
| :--- | :--- | :--- | :--- |
| `user_registered` | User successfully creates a new account on `/register`. | `provider` (string: email/google) | Measure top-of-funnel acquisition and marketing conversion. |
| `login_success` | User successfully authenticates on `/login`. | `method` (string) | Track active user sessions and retention. |
| `login_failed` | User fails to authenticate. | `reason` (string) | Identify friction points or potential malicious activity at login. |
| `onboarding_started` | User lands on the first step of the Onboarding Wizard. | *None* | Track drop-off between registration and onboarding start. |
| `onboarding_completed` | User successfully submits the final step of the Onboarding Wizard. | `duration_seconds` (number) | Measure the onboarding funnel conversion rate. |
| `health_plan_generated` | Server successfully completes the AI generation of a health plan. | `plan_id` (string), `success` (boolean) | Monitor AI generation reliability and latency. |
| `dashboard_viewed` | User navigates to `/dashboard`. | *None* | Measure core product engagement and Daily Active Users (DAU). |
| `daily_checkin_started` | User interacts with a tracker on the dashboard for the first time on a given day. | `metric_type` (string) | Determine how many active users actually engage with the daily tracking habit. |
| `daily_checkin_completed` | User reaches 100% of their daily targets across all core metrics. | *None* | Measure product success and habit formation. |
| `habit_completed` | User checks off a specific habit in the daily checklist. | `habit_name` (string) | Understand which habits are most frequently completed or skipped. |
| `progress_viewed` | User navigates to the `/dashboard/progress` page. | *None* | Evaluate interest in long-term insights and analytical features. |
| `logout` | User actively clicks the sign out button. | *None* | Measure session end intentionally versus session expiration. |
| `error_occurred` | A global error boundary catches an exception or a critical server action fails. | `error_type` (string), `route` (string) | Proactively identify broken UX flows and monitor application reliability. |

## Global Properties
All events will automatically include:
- `distinct_id` (Anonymized user ID)
- `timestamp`
- `browser` / `os` / `device_type`
- `current_url`
