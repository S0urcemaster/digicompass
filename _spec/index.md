# Digi Compass Agent Specification

Digi Compass is a web application for building personal mindset collections from short sayings paired with images.

Users browse a base library of sayings and images, add selected items to their own collection, combine collected sayings and collected images into foci, group collected foci into mindsets, and rate or annotate the result.

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

### CategoryPaginator

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
- The main image uses a `733x1024` aspect ratio
- The saying is rendered directly on top of the image near the top
- The current focus is shown as the large image
- Up to 4 other foci from the same mindset are shown as preview tiles
- Clicking a preview tile makes it the current focus
- A mindset selector above the image area switches the current mindset
- Additional cards below the image area show focus rating, categories, and notes
- The app shell also contains a username field and a top-level view switcher for `Navigator`, `Compass`, and `Collection`

Current implementation note:

- `image.color` matches the filename tone, and the saying text color in the views is rendered as the opposite tone

### Compass Layout Draft

- Vertical layout
- Horizontal paginator or filter for category

### Collection View

### Overview

- Manage what belongs to the user's personal collection
- Support selecting items from the base library into the collection
- Provide separate tabs for images, sayings, foci, and mindsets

### Images

- Browse all available images from `src/data/images.json`
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
