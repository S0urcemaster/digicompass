# Frontend Toolchain Proposal

## Chosen Stack

- Framework: React 18 + TypeScript + Vite
- State management: Zustand (local editing/session state) + TanStack Query (async/server cache)
- Styling: Tailwind CSS + CSS variables for theme tokens

## Why this stack

- Fast iteration and simple deploy pipeline with Vite
- Typed domain modeling for Digi Compass entities (mindsets, foci, sayings, images)
- Lightweight client state for editor workflows without boilerplate
- Clear split between local UI state and remote data synchronization

## Implemented in Task 1

- Toolchain configs (`vite`, `typescript`, `eslint`, `tailwind`)
- Base React app shell and domain/store scaffolding
- Initial component structure
