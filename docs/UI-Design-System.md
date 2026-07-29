# UI Design System

## Design Philosophy
FeedHope's design must evoke feelings of calm, clarity, and encouragement. It should never feel overwhelming or punitive. We utilize modern glassmorphism, subtle gradients, and generous whitespace to create a premium, enterprise-grade consumer experience.

## Colour Palette
- **Primary:** Deep Oceanic Blue (`#0F172A`) - Conveys trust, enterprise-quality, and calm.
- **Secondary / Accent:** Vibrant Teal (`#14B8A6`) - Used for primary actions, progress bars, and positive reinforcement.
- **Background (Light Mode):** Off-White/Pearl (`#F8FAFC`) - Softer than pure white to reduce eye strain.
- **Background (Dark Mode):** Midnight (`#09090B`) - Deep, immersive dark mode.
- **Success:** Emerald (`#10B981`)
- **Warning:** Amber (`#F59E0B`)
- **Error:** Rose (`#E11D48`)

## Typography
- **Font Family:** `Inter` (sans-serif) for UI elements, `Outfit` or `Plus Jakarta Sans` for headings to give a modern, clean feel.
- **Scale:**
  - `h1`: 2.5rem (Bold, tight tracking)
  - `h2`: 2rem (Semibold)
  - `h3`: 1.5rem (Medium)
  - `body-large`: 1.125rem (Regular)
  - `body`: 1rem (Regular, 1.5 line height for readability)
  - `caption`: 0.875rem (Medium, muted colour)

## Spacing
An 8-point grid system is used consistently.
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

## Core Components
- **Cards:** Used to group related information (e.g., a Habit Card on the Dashboard). Must have subtle shadows (`shadow-sm`) and rounded corners (`rounded-xl` or `rounded-2xl`).
- **Buttons:**
  - `Primary`: Solid Teal background, white text, slight hover lift animation.
  - `Secondary`: Outline or subtle transparent background.
  - `Ghost`: Text only, used for tertiary actions.
- **Progress Indicators:** Circular rings and linear bars with smooth, interpolated animations when values change.
- **Forms:** Clean, large touch targets for the health assessment questionnaire.

## Accessibility (a11y)
- **Contrast:** Ensure all text passes WCAG AA standards (4.5:1 ratio).
- **Interactive Elements:** Minimum touch target size of 44x44px for mobile.
- **Screen Readers:** Comprehensive `aria-labels` on all icon-only buttons. Semantic HTML throughout.

## Mobile-First Strategy
The application is designed for mobile viewports first, ensuring core tracking interactions require only one hand (bottom-sheet navigation, easy-to-reach FABs). Desktop/Tablet views will expand to utilize multiple columns (e.g., Dashboard + Assessment side-by-side).
