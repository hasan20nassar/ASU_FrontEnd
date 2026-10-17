# AI Development Rules for Antioch Syrian University (ASU) App

## Technical Stack
- **Framework**: Next.js 15+ (App Router) with React 19.
- **Language**: TypeScript for strict type safety and better IDE support.
- **Styling**: Tailwind CSS v4 using modern OKLCH color spaces.
- **UI Components**: Shadcn/UI (Radix UI primitives) for accessible, consistent components.
- **Animations**: Framer Motion for complex interactions and Tailwind Animate for simple transitions.
- **Icons**: Lucide React for a unified iconography system.
- **Smooth Scrolling**: Lenis for premium inertia-based scrolling.
- **Internationalization**: Custom Context-based i18n supporting Arabic (RTL) and English (LTR).

## Library Usage Rules
- **Icons**: Exclusively use `lucide-react`. Do not import from other icon libraries.
- **Forms**: Use `react-hook-form` with `zod` for validation.
- **Charts**: Use `recharts` wrapped in Shadcn chart components.
- **Toasts**: Use `sonner` or the built-in `use-toast` hook for notifications.
- **Components**: Always use Shadcn/UI components as a base. If a component doesn't exist in `components/ui`, create it there using Radix UI.

## Component & Project Structure
- **Immediate File Creation**: Every new component must have its own file. Never define multiple components in one file.
- **File Sizing**: Aim for components under 100 lines of code. Refactor large components into smaller, reusable sub-components.
- **Directories**: 
  - `app/`: Routing and page layouts.
  - `components/ui/`: Atomic UI primitives (buttons, inputs, etc.).
  - `components/layout/`: Global elements (Navbar, Footer).
  - `components/[feature]/`: Feature-specific components (e.g., `components/home/`).
  - `contexts/`: React Context providers for state.
  - `data/`: Mock data and static content configurations.

## Internationalization (i18n) & RTL
- **Translation Hook**: Always use the `useLanguage` hook and the `t()` function for text.
- **Directionality**: Use the `dir` variable from `useLanguage` to handle RTL/LTR specific logic (e.g., flipping arrows or adjusting padding).
- **Arabic Support**: Ensure fonts like `Tajawal` or `Cairo` are applied for Arabic text via the `HtmlDirUpdater`.
- **Responsive Layouts**: Always test layouts in both "ar" and "en" modes to ensure UI doesn't break when mirrored.

## Coding Standards
- **Simplicity**: Do not overengineer. Prioritize readability and maintainability.
- **Responsive Design**: Use Tailwind's mobile-first breakpoints (`sm:`, `md:`, `lg:`, `xl:`).
- **Client Components**: Use `"use client";` directive only when necessary (state, effects, or browser APIs).
- **Mock Data**: Use the existing files in `data/` for content instead of hardcoding strings in components.