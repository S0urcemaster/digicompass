# Digi Compass Agent Specification

Digi Compass is a web application for building personal mindset collections from short sayings paired with AI images.

Users browse a base library of sayings and images, add selected items to their own collection, combine collected sayings and collected images into foci, group collected foci into mindsets, and rate or annotate the result.

## Project Structure

- `_spec/`: This specification
- `frontend/`: Web frontend (React + TypeScript + Vite)
- `frontend/src/types/domain.ts`: Base domain model types
- `frontend/src/store/compassStore.ts`: Client state store (Zustand + persist)
- `frontend/src/app/` and `frontend/src/components/`: Application shell and UI components

## Technology

- Framework: React 18 + TypeScript
- Build tool: Vite
- State management: Zustand for local editing and session state
- Persistence: Zustand `persist` with browser localStorage
- Data fetching/cache: TanStack Query is installed and provided at app root, but not yet used for remote data
- Styling: Tailwind CSS with CSS variables
- Linting: ESLint (TypeScript + React hooks)

## Base Data

- Categories
- Sayings
- AI images

## Model

### DigiCompass

- username
- mindsets: Mindset[]
- collection: Collection

### Mindset

- name
- foci: Focus[] (currently intended to be limited to 5)
- rating: Rating
- notes

### Focus

- saying: Saying
- image: CompassImage
- rating: Rating
- notes

### Saying

- id
- text
- fontSize
- categories: Category[]
- rating: Rating

### CompassImage

- id
- url
- color
- categories: Category[]
- rating: Rating

`color` stores the image tone from the filename such as `hell`, `dunkel`, `hell dunkel`, or `dunkel hell`.

### Category

- id
- text

### Collection

- sayings: Saying[]
- images: CompassImage[]
- foci: Focus[]
- mindsets: Mindset[]

The collection is the user's working set. Users do not work directly on the whole base library when creating higher-level objects.

Creation rules:

- A focus may only be created from a saying that is already in `collection.sayings`.
- A focus may only be created from an image that is already in `collection.images`.
- A mindset may only be created from foci that are already in `collection.foci`.
- `collection.mindsets` contains only mindsets assembled from collected foci.

### Rating

- decimal from 0 to 1

## Store Shape

The persisted CompassStore currently contains both domain data and UI state:

- `data: DigiCompass`
- `activeView: 'primary' | 'focus-editor' | 'collection'`
- `selectedMindsetIndex: number`
- `selectedFocusIndex: number`

The store currently supports:

- changing username
- switching the active top-level view
- selecting the current mindset
- selecting the current focus
- adding, removing, and updating mindsets
- adding, removing, and updating foci within a mindset

## Functions Overview

### Implemented now

- Display username
- Change username
- Display current mindset
- Display list of other mindsets
- Select current mindset
- Select current focus within the mindset
- Switch between top-level views

### Planned next

#### Edit Mindset

- Change mindset name
- Display list of set foci
- Add focus from the personal collection only
- Remove focus
- Rate mindset

#### Edit Focus

- Select saying from the personal collection
- Change saying categories
- Change saying rating
- Select image from the personal collection
- Change image categories
- Change image rating

#### Collection Management

- Add and remove sayings from the personal collection
- Add and remove images from the personal collection
- Add and remove foci from the personal collection
- Add and remove whole mindsets from the personal collection
- Create foci only from collected sayings and collected images
- Create mindsets only from collected foci

## Frontend

Mobile first.

### Local Storage

For a new user, a localStorage-backed CompassStore is created. For a returning user, the persisted store is reused.

Autosave happens through Zustand persistence after each state change.

In development mode, the app reloads `factoryState` on browser refresh instead of reusing persisted localStorage data.

### Views

Only one top-level view is active at a time:

- `Primary`: shows the currently active mindset
- `Focus Editor`: placeholder route, not yet designed as a standalone screen
- `Collection`: screen for managing the personal collection

## Primary View

This is the main implemented view.

- It shows the currently selected focus of the currently selected mindset from CompassStore.
- The main image uses a `733x1024` aspect ratio.
- The saying is rendered directly on top of the image near the top.
- The current focus is shown as the large image.
- Up to 4 other foci from the same mindset are shown as preview tiles.
- Clicking a preview tile makes it the current focus.
- A mindset selector above the image area switches the current mindset.
- Additional cards below the image area show focus rating, categories, and notes.
- The app shell also contains a username field and a top-level view switcher for `Primary`, `Focus Editor`, and `Collection`.

Current implementation note:

- `image.color` matches the filename tone, and the saying text color in the views is rendered as the opposite tone.

## Focus Editor View

This view exists in store state and in the top-level navigation, but it is not designed yet as a separate UI.

Planned purpose:

- join an image with a saying into a focus
- edit focus-level metadata

Current note:

- focus preview and selection currently happen inside the `Collection` view under `Foci`

## Collection View

### Overview

- Manage what belongs to the user's personal collection
- Support selecting items from the base library into the collection
- Provide separate tabs for images, sayings, foci, and mindsets

### Images

- Browse all available images from `data/images.ts`
- Split layout: selected image on the left, paged 3-column preview grid on the right
- Use preview assets from `public/images/preview` in the grid
- Filter the image list by category text
- No separate add button
- The 5-star control on the large image adds the image to the collection and sets its rating
- The image can be opened in a larger modal view for closer inspection

### Sayings

- Browse all available sayings from the base data
- Filter the list by category text
- Rating a saying adds it to the collection and sets its rating
- The current UI uses a compact list instead of a large detail card

### Foci

- Browse collected foci and filter them by category text
- Show a large focus preview with saying and image combined
- Allow rating existing collected foci
- Allow assembling a focus preview from collected images and collected sayings only
- A dedicated save/create flow for new foci is still pending

### Mindsets

- Pending
