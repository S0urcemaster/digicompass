# Digi Compass Agent Specification

Digi Compass is a web application for building personal mindset collections from short sayings paired with images.

Users browse a base library of sayings and images, add selected items to their own collection, combine collected sayings and collected images into foci, group collected foci into mindsets, and rate or annotate the result.

## Architecture Rule

- No local one-off components may be created inside other files
- Every UI element must be implemented as its own reusable component or as a derived component based on an existing component
- This rule also applies to views: every view is a component, not inline local composition

## Current Product Core

- The user always works on their personal collection, never directly on the whole base library when creating higher-level objects.
- A focus may only be created from a saying already present in `collection.sayings`.
- A focus may only be created from an image already present in `collection.images`.
- A mindset may only be created from foci already present in `collection.foci`.
- `collection.mindsets` contains only mindsets assembled from collected foci.

## Views

Only one top-level view is active at a time:

- `navigator`
- `compass`
- `collection`

## App Layout

- Portrait-first layout
- The app is narrow and primarily sized for smartphones
- On desktop, the app keeps the same aspect ratio and is framed by side margins
- By default, the main app components touch each other without outer gaps or spacing between component blocks

## App Shell

### Header

Vertical order:

- App title: `Digi Compass`
- Subtitle: `Mindsets for real situations`
- Primary tabs: `MainTab`

### MainTab

Available tabs:

- `Navigator`
- `Compass`
- `Collection`

## Component Layout

### Button

- There is one shared base button class used throughout the application

### StarRating

- Horizontal row of 5 star buttons
- Used to assign the rating of the related element
- Stars can be configured as active or inactive without changing their visual shape

### Card (abstract)

- Used for images or foci
- Aspect ratio: `5:7`

Optional card content:

- assigned categories in the top-left corner
- text content, when available, rendered as large as practical in the central area
- `StarRating` across the full width at the bottom

Card sizes:

- `Selected Card`: `1/2` of content width
- `Preview Card`: `1/4` of content width

### CategoryFilter

- Horizontal row of 3 evenly distributed buttons
- Buttons:
- `<-` for previous category
- current category label
- `->` for next category
- The component sets the category filter of the connected list

### Paginator

- Always horizontal
- Child elements are distributed evenly across the available width

### CardBrowser

- Arrangement of cards or the concrete card subtypes for `CompassImage` or `Focus`
- Contains one `SelectedCard` in the top-left
- Contains 4 preview cards in a `2x2` block to the right of the selected card
- Contains 4 additional preview cards in one row below
- Clicking a preview card replaces the selected card

### SayingsBrowser

- A browser component for sayings derived from the same interaction model as `CardBrowser`
- It displays one selected saying and multiple preview sayings
- Clicking a preview saying replaces the selected saying
- It may use saying-specific subcomponents instead of image or focus cards

### MindsetPaginator

- Horizontal paginator for switching the active mindset
- Child elements are distributed evenly across the available width
- The component changes the active mindset in the connected store or parent state

### HorizontalBrowser

- A horizontal browser component for paged item lists
- Items are arranged in one horizontal row
- The browser is used for selectable lists of cards or tiles
- Paging controls belong to the browser
- Clicking an item selects it or assigns it, depending on the connected workflow

## Domain Model

### DigiCompass

- username
- mindsets: `Mindset[]`
- collection: `Collection`

### Mindset

- name
- foci: `Focus[]`
- rating: `Rating`
- notes

Current intention:

- A mindset is currently intended to be limited to 5 foci

### Focus

- saying: `Saying`
- image: `CompassImage`
- rating: `Rating`
- notes

### Saying

- id
- text
- fontSize
- categories: `string[]`
- rating: `Rating`

### CompassImage

- id
- url
- color
- category: `string`
- rating: `Rating`

Notes:

- `url` stores only the image filename
- `color` stores the image tone from the filename such as `hell`, `dunkel`, or `mix`

### Category

- plain string

### Collection

- sayings: `Saying[]`
- images: `CompassImage[]`
- foci: `Focus[]`
- mindsets: `Mindset[]`

### Rating

- decimal from `0` to `1`

## Store Shape

The persisted `CompassStore` contains both domain data and UI state:

- `data: DigiCompass`
- `activeView: 'navigator' | 'compass' | 'collection'`
- `selectedMindsetIndex: number`
- `selectedFocusIndex: number`

The store currently supports:

- changing username
- switching the active top-level view
- selecting the current mindset
- selecting the current focus
- adding, removing, and updating mindsets
- adding, removing, and updating foci within a mindset

## View Specifications

### Compass View

This is the main implemented view.

- It shows the currently selected focus of the currently selected mindset from `CompassStore`
- It is composed of a `MindsetPaginator`, a `CardBrowser`, and a `textarea`
- The `MindsetPaginator` switches the active mindset
- The `CardBrowser` displays the current focus as the selected card and the other focus options of the same mindset as preview cards
- Clicking a preview card changes the selected focus
- The `textarea` displays or edits the notes of the active mindset

Current implementation note:

- `image.color` matches the filename tone, and the saying text color in the views is rendered as the opposite tone

### Compass Layout Draft

- Vertical layout
- `MindsetPaginator` at the top
- `CardBrowser` below it
- `textarea` below the `CardBrowser`

### Collection View

### Overview

- Manage what belongs to the user's personal collection
- Support selecting items from the base library into the collection
- Provide separate tabs for images, sayings, foci, and mindsets

### Images

- Browse all available images from `src/data/images.json`
- It is composed of a `CategoryFilter` and a `CardBrowser`
- The `CategoryFilter` filters the image set by category
- The `CardBrowser` shows the selected image and the paged preview images
- Use preview assets from `public/images/preview` in the grid

### Sayings

- Browse all available sayings from the base data
- It is composed of a `CategoryFilter` and a `SayingsBrowser`
- The `CategoryFilter` filters the saying set by category
- The `SayingsBrowser` shows the selected saying and the available preview sayings
- Rating a saying adds it to the collection and sets its rating
- The current UI uses a compact list instead of a large detail card

### Foci

- It is composed of 3 `CardBrowser` components and one dedicated button row to toggle between
- The button row switches which `CardBrowser` is currently active
- Initially, the focus list browser is active
- The first button shows the focus list and allows the user to choose an existing focus
- After switching away from the focus list mode, 2 additional buttons become active
- One additional button shows image cards
- One additional button shows saying cards
- The image browser and saying browser are used to assemble or inspect focus parts
- The focus-related browsers operate only on collected items
- Allow rating existing collected foci

### Mindsets

- The upper area shows the active mindset
- The active mindset contains:
- a name field
- a `StarRating`
- up to 5 focus slots
- Each focus slot can hold one focus from the collection
- Existing mindsets are shown through a representative focus preview with the mindset name overlaid
- The lower area switches between 2 list modes:
- `Mindsets`
- `Foci`
- The lower area contains 2 `HorizontalBrowser` instances
- One `HorizontalBrowser` is for existing collection mindsets
- One `HorizontalBrowser` is for collected foci
- Only one of those 2 `HorizontalBrowser` instances is active at a time
- In `Mindsets` mode, the user browses existing collection mindsets
- In `Foci` mode, the user browses collected foci and assigns them into the currently active mindset slots
- A dedicated `+` tile creates a new mindset draft
- Selecting an existing mindset loads it into the editor
- Creating or editing a mindset works only with collected foci


### Navigator View

- Not defined yet

## Planned Editor Scope

### Focus Editor View

This view exists in store state and in the top-level navigation, but it is not yet designed as a separate screen.

Planned purpose:

- join an image with a saying into a focus
- edit focus-level metadata

Current note:

- focus preview and selection currently happen inside the `Collection` view under `Foci`

## Functions Overview

### Implemented

#### App Shell

- Display username
- Change username
- Switch between top-level views

#### Compass View

- Display the current mindset
- Display the current focus of the current mindset
- Select the active mindset
- Select the active focus within the current mindset
- Edit mindset notes through the textarea
- Rate the currently selected focus

#### Collection: Images

- Browse all base images
- Filter images by category
- Page through image previews
- Select an image
- Open the selected image in a larger modal view
- Add an image to the collection by rating it
- Change the rating of a collected image

#### Collection: Sayings

- Browse all base sayings
- Filter sayings by category
- Page through saying results
- Select a saying
- Add a saying to the collection by rating it
- Change the rating of a collected saying

#### Collection: Foci

- Browse collected foci
- Filter foci by category
- Page through focus results
- Select an existing focus
- Switch between focus list mode, image mode, and saying mode
- Select collected images for focus assembly
- Select collected sayings for focus assembly
- Preview the assembled focus
- Add a new focus to the collection by rating it
- Change the rating of an existing collected focus
- Remove a collected focus by setting its rating to `0`

#### Collection: Mindsets

- Browse collection mindsets
- Browse collected foci for mindset assignment
- Page through both mindset and focus lists
- Create a new mindset draft
- Load an existing mindset into the editor
- Change mindset name
- Assign collected foci into up to 5 mindset slots
- Create a mindset from the current draft by rating it
- Change the rating of an existing mindset
- Remove a mindset by setting its rating to `0`

### Partially Implemented

#### Focus Editing

- Focus creation already works inside `Collection > Foci`
- Focus editing is currently split across list selection, preview, and rating interactions
- There is no separate finalized `Focus Editor View` screen yet

#### Mindset Editing

- Mindset creation and editing already work inside `Collection > Mindsets`
- The current flow is editor-like, but not yet formalized into a separate dedicated component architecture

### Not Defined Yet

- `Navigator` view behavior
- Final save flow and finalized UX rules for focus creation
- Finalized standalone `Focus Editor View`

## Data Sources

- `frontend/src/data`: sayings, categories, and image references
- `frontend/public/images`: full-size image assets
- `frontend/public/images/preview`: preview image assets

## Project Structure

- `_spec/`: specification files
- `frontend/`: web frontend

## Frontend Runtime Notes

### Local Storage

- For a new user, a localStorage-backed `CompassStore` is created
- For a returning user, the persisted store is reused
- Autosave happens through Zustand persistence after each state change
- In development mode, the app reloads `factoryState` on browser refresh instead of reusing persisted localStorage data


## Implementation Notes

Use this order when rebuilding or extending the project:

1. Treat this spec as the primary source of truth for structure, behavior, and composition.
2. Treat `frontend/src/data/*.json` and `frontend/public/images/**` as source data, not UI implementation.
3. Prefer rebuilding thin, explicit components from the spec over preserving inconsistent legacy code.
4. Follow the component rule strictly: no local one-off components inside other files.
5. Build shared components first, then compose views from those components.
6. Keep data loading, state transitions, and presentation separable.
7. When the current implementation differs from the spec, update the spec first if the new behavior is intentional.
8. Use the current implementation only as extraction material, not as a hard constraint.
9. Move outdated planning notes downward instead of deleting them immediately when they may still be useful for revision.

### Current Build Priorities

- Keep the JSON data model and image assets stable
- Align `compassStore` and domain types with the current spec
- Rebuild collection-related browsers from reusable shared components
- Preserve the current visual structure where the spec already defines it
- Defer `Navigator` until the existing collection and compass workflows are clean again

### Working Rule For Open Tasks

- Keep only the next genuinely actionable items in the active task list
- Move completed items to `Finished Tasks`
- Move obsolete or already-covered items into a legacy subsection instead of mixing them with active tasks

### Planned Tasks

- Complete the first reusable component drafts from the current spec
- Align the remaining implementation with the JSON-based data model

### Open Tasks

- Update the remaining implementation from category objects to string categories
- Update the remaining implementation from image category lists to single image categories
- Replace remaining TypeScript data imports with JSON-based loading or adapters
- Extract the first reusable component set from the existing views
- Rebuild `Compass View` from `MindsetPaginator`, `CardBrowser`, and `textarea`
- Rebuild `Collection View` sections from the currently specified browser components

### Finished Tasks

- Restructured `_spec/index.md` so the active specification is at the top and legacy material is separated below
- Converted data files from TypeScript data modules to JSON
- Reduced categories to plain strings
- Reduced image category data to a single category field
- Updated major parts of the spec to match the current implementation behavior

### Legacy Copy

The following block is kept as a verbatim planning snapshot for later comparison and revision.

#### Legacy Implementation Notes

Implement the next planned task. When finished:

- move the planned task to the closed tasks section
- move the next open task into the planned tasks section

#### Legacy Planned Tasks

- Propose the frontend toolchain (framework, state management, styling, and test setup), then implement it

#### Legacy Open Tasks

- Ensure data files are present and consistent with the spec
- Set up `/frontend` with the chosen toolchain and base project structure
- Update the model description in `_spec/index.md` with my changes in `domain.ts`
- Update `compassStore` with the `_spec` and `domain.ts` changes. Leave the `factoryMindsets` alone for now
- Redesign the frontend towards the `## Frontend` section in `_spec/index.md`
- Write to the spec that a user always works on their collection and never on the whole data, so foci are created from images and sayings the user has already chosen into the collection, and mindsets only use foci from the collection
- Update the image data with the updated files in `public/images`, using the opposite text color to the file name tone
- Create a factory collection in `store/factoryState.ts`: 20 sayings, 20 images, 10 foci, and 3 mindsets. Use random combinations for now without sticking to categories. This is dummy data for the next task
- Implement the `Collection View / Images` section of the spec

#### Legacy Finished Tasks

- none recorded here yet
