# Frontend Implementation Standards

## Framework & Styling
- **Framework:** Next.js 14 App Router, built strictly with TypeScript.
- **Styling:** Strictly Tailwind CSS. 
- **Theming:** Rely on the project's custom "card-glow" effects and the defined `TOPIC_COLORS` mapping for visual consistency. Do not invent arbitrary hex codes.

## Animations
- All interactive transitions (scrolling behavior, button pops, chat entry animations) must use `framer-motion`.

## Interactive Logic
- The **"Typewriter"** effect within `KnowledgeCard.tsx` MUST ALWAYS incorporate a cleanup function (e.g. timeout clearance) to prevent memory leaks during rapid vertical scrolling.

## Component Responsibilities & Cleanliness
Keep component logic highly modular:
- **Heavy State Management:** Data fetching and feed queue management belongs in `FeedContainer.tsx` (or custom hooks like `useFeed.ts`).
- **Visual Rendering:** UI specifics, interactions, and typewriting effects belong inside `KnowledgeCard.tsx`.

## Coding Principles: Type Safety
- Mandatory TypeScript interfaces must be strictly maintained for all API responses inside `frontend/lib/api.ts`.
- Avoid `any` types. Ensure exact alignment between Pydantic schemas in the backend and TypeScript interfaces in the frontend.
