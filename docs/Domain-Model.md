# FeedHope Domain Model (M2)

## 1. Product Vision
FeedHope is an enterprise-grade personal health platform that empowers individuals to cultivate sustainable, healthier habits through personalized guidance, ongoing support, and actionable insights. It serves as a continuous companion that aligns long-term user health success with a resilient subscription business model.

## 2. Bounded Contexts
To manage complexity, the FeedHope domain is divided into distinct boundaries:
- **Identity Context**: Manages user authentication, core profile details, and account lifecycle.
- **Health Context**: Manages the user’s health data, baseline assessments, and personalized health plans.
- **Progress Context**: Manages daily engagement, habit tracking, and the logging of check-ins.
- **Subscription Context**: Manages billing cycles, access tiers, and platform monetization.

## 3. Core Aggregates
Aggregates are clusters of domain objects that can be treated as a single unit.

- **User**: The central root of the Identity context. Represents the human interacting with the system.
- **Health Profile**: A comprehensive summary of a user’s physical characteristics and long-term health objectives.
- **Health Assessment**: A point-in-time evaluation of a user's health state, used to generate their plan.
- **Health Plan**: The personalized, actionable roadmap consisting of habits, goals, and recommendations for the user.
- **Daily Check-in**: A specific log entry detailing a user's adherence to their Health Plan on a given day.
- **Subscription**: The commercial agreement dictating the user's access rights and billing state.

## 4. Entities
Entities possess a distinct identity that runs through time and different states.

- **Purpose**: Entities exist to track mutable state over time while ensuring business invariants remain consistent.
- **Responsibilities**: Entities are responsible for validating state changes (e.g., a Health Plan cannot be marked "completed" if it has no habits assigned).
- **Ownership**: The Aggregate Root (e.g., User, Health Plan) owns its internal entities (e.g., Plan Tasks) and controls all access and modification to them.

## 5. Value Objects
Value Objects are immutable and defined purely by their attributes rather than a unique identity.

- **Measurements**: Represents physical metrics (e.g., Weight, Height, Blood Pressure). Two Measurements with identical values are indistinguishable.
- **Goals**: Represents the target outcomes (e.g., Target Weight, Target Steps).
- **Preferences**: User settings (e.g., Notification Times, Dietary Restrictions).
- **Health Metrics**: Standardized calculated indicators (e.g., BMI, Sleep Score).

## 6. Relationships
- **User owns Health Profile, Subscription, and Health Plans**: A User acts as the ultimate owner. Deleting a User conceptually removes or anonymizes all associated aggregates.
- **Health Profile owns Health Assessments**: Assessments are historical records attached to the profile.
- **Health Plan owns Daily Check-ins**: Check-ins must be linked to an active Health Plan to measure adherence against specific goals.

## 7. Business Rules (MVP)
- A User must have an active Subscription (or trial) to generate a new Health Plan.
- A User can only have one active Health Plan at any given time.
- A Health Assessment must be completed before a Health Plan can be generated.
- Daily Check-ins are restricted to the current local date of the user; future check-ins are not permitted.
- Weight measurements must be within physically possible human limits.

## 8. Domain Events (Future)
Events represent significant occurrences within the domain that other contexts may react to.

- **Assessment Completed**: Triggered when a user finishes an onboarding or periodic evaluation.
- **Health Plan Created**: Triggered when a new personalized roadmap is finalized.
- **Daily Check-in Recorded**: Triggered when the user logs their daily progress, potentially updating streaks.
- **Subscription Activated**: Triggered when payment succeeds, granting premium access.

## 9. MVP Boundary

### MVP Scope
- Core identity and onboarding.
- Submission of a single baseline Health Assessment.
- Generation of a static Health Plan.
- Manual Daily Check-ins (binary completion of habits).
- Basic Subscription tiers (Free/Trial vs. Premium).

### Future Versions (Out of Scope for MVP)
- Integrations with Apple HealthKit, Google Fit, or wearable devices.
- Dynamic, AI-driven daily adjustments to the Health Plan.
- Advanced community features or social sharing.
- Enterprise (B2B) corporate wellness dashboards.
- Clinical integrations or medical record syncing.
