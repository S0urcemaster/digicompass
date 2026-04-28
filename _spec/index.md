# Digi Compass Agent Specification

Digi Compass is a web application that aims at generating collections of human mindsets out of short passages of text / sayings combined with AI pictures.

A user can choose from a sayings and image database and combine them to a mindset object which can be rated and annotated.

## Project Structure

- `_spec/`: This specification
- `frontend/`: Web frontend (React + TypeScript + Vite)
- `frontend/src/types/domain.ts`: Base domain model types
- `frontend/src/store/compassStore.ts`: Initial client state store (Zustand)
- `frontend/src/app/` and `frontend/src/components/`: Base application shell and UI components

## Technology

- Framework: React 18 + TypeScript
- Build tool: Vite
- State management: Zustand for local editing/session state
- Data fetching/cache: TanStack Query
- Styling: Tailwind CSS with CSS variables
- Linting: ESLint (TypeScript + React hooks)

## Base Data

- Categories
- Sayings
- AI Images

## Model

### DigiCompass
- username
- mindsets: Mindset[]

### Mindset
- name
- foci: Focus[]
- rating: Rating
- notes

### Focus
- saying
- image
- rating: Rating
- notes

### Saying
- text
- categories: Category[]
- rating: Rating

### Image
- url
- categories: Category[]
- rating: Rating

### Category
- text

### Rating
- decimal 0-1

## Functions Overview

### DigiCompass
- Display username
- Change username
- Display current Mindset
- Display list of other Mindsets
- Select current Mindset by selecting other mindset
- Edit Mindset

### Edit Mindset
- Change Mindset name
- Display list of set Foci
- Add Focus
- Remove Focus
- Rate Mindset

### Edit Focus
- Select saying
- Change saying categories
- Change saying rating
- Select image
- Change image categories
- Change image rating

## Frontend
- Mobile First
