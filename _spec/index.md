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

### Implemented Now

- Display username
- Change username
- Display current mindset
- Display list of other mindsets
- Select current mindset
- Select current focus within the mindset
- Switch between top-level views

### Planned Next

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
- Change image category
- Change image rating

#### Collection Management

- Add and remove sayings from the personal collection
- Add and remove images from the personal collection
- Add and remove foci from the personal collection
- Add and remove whole mindsets from the personal collection
- Create foci only from collected sayings and collected images
- Create mindsets only from collected foci

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

Implement the next planned task. When finished:

- move the planned task to the closed tasks section
- move the next open task into the planned tasks section

### Planned Tasks

- Propose the frontend toolchain (framework, state management, styling, and test setup), then implement it

### Open Tasks

- Ensure data files are present and consistent with the spec
- Set up `/frontend` with the chosen toolchain and base project structure
- Update the model description in `_spec/index.md` with my changes in `domain.ts`
- Update `compassStore` with the `_spec` and `domain.ts` changes. Leave the `factoryMindsets` alone for now
- Redesign the frontend towards the `## Frontend` section in `_spec/index.md`
- Write to the spec that a user always works on their collection and never on the whole data, so foci are created from images and sayings the user has already chosen into the collection, and mindsets only use foci from the collection
- Update the image data with the updated files in `public/images`, using the opposite text color to the file name tone
- Create a factory collection in `store/factoryState.ts`: 20 sayings, 20 images, 10 foci, and 3 mindsets. Use random combinations for now without sticking to categories. This is dummy data for the next task
- Implement the `Collection View / Images` section of the spec

### Finished Tasks

- none recorded here yet

## Revision Notes / Legacy Draft

This section keeps duplicate, outdated, or still unresolved material for later review instead of mixing it into the current working spec.

### Legacy Naming

- Earlier drafts used the top-level views `Primary`, `Focus Editor`, and `Collection`
- The current active naming is `navigator`, `compass`, and `collection`

### Legacy Project Structure Notes

- Earlier drafts referenced `data/images.ts`
- Current data references should point to JSON-based files instead

### Legacy Frontend Heading

- Earlier drafts used a broader `Frontend` section with mixed technology and feature notes
- The current file separates product structure, component layout, view behavior, and implementation notes more explicitly
