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
- id
- text
- fontSize
- categories: Category[]
- rating: Rating

### Image
- id
- url
- categories: Category[]
- rating: Rating

### Category
- id
- text

### Collection
- sayings: Saying[]
- images: Image[]
- foci: Focus[]
- mindsets: Mindset[]

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

Mobile first

### Local Storage

A localstorage CompassStore object is created for a new user or reused if exists
Autosave : After every action : the localStorage is updated
In dev mode the factoryState is reloaded on each browser reload instead of reusing persisted localStorage data

There are different views / of which only 1 is active at once

- Primary : Shows your currently active Mindset
- Focus- Editor : Join an image with a saying
- Collection : Add and remove sayings, images, foci and whole mindsets to your collection
- 

### Primary View

Here you can see the first focus of the first (=current) mindset in compassstore . The image is displayed in half screenwidth together with the saying directly on it in big letters / with saying.fontSize near the top . The other 4 foci are located right of the main focus also with the text on it in a 2x2 square : matching the big image,s size

The image has to be cut to a size of 733x1024

Sayings on images use bright text on images with "dunkel" in the filename and dark text on images with "hell" in the filename

The saying on the main image is larger than the sayings on the 2x2 preview images

Clicking on one of the other foci makes that one the current one / displays the big image together with the saying above it

Above the first mindset image is a mindset selector . There you can switch your current situation

Below the image area there are additional cards for focus rating / categories / notes

The app shell also contains a username field and a top level view switcher for Primary / Focus Editor / Collection
