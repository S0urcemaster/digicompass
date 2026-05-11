# Views

This file defines top-level and planned view components. Each entry should make view boundaries, state ownership, data scope, and interaction intent explicit.

## Compass View

- Kind: `View Component`
- Status: current main implemented view
- Purpose: show and edit the currently active mindset context from `CompassStore`
- Composition:
- `MindsetPaginator`
- `CardBrowser`
- `textarea`
- State Ownership:
- reads active mindset and active focus selection from `CompassStore`
- writes active mindset selection to `CompassStore`
- writes active focus selection to `CompassStore`
- writes active mindset notes to `CompassStore`
- Data Scope:
- current mindset from `data.mindsets`
- current focus from the selected mindset
- Layout Rules:
- vertical layout
- `MindsetPaginator` at the top
- `CardBrowser` below it
- `textarea` below the `CardBrowser`
- Interaction Rules:
- `MindsetPaginator` switches the active mindset
- `CardBrowser` displays the current focus as a selected `FocusCard`
- preview items in the same browser are rendered as `PreviewCard` variants of `FocusCard`
- preview ratings in this browser are display-only unless a workflow explicitly enables rating interaction there
- clicking a preview card changes the selected focus
- `textarea` displays or edits the notes of the active mindset
- Display Rules:
- `image.color` matches the filename tone, and the saying text color in the views is rendered as the opposite tone
- saying text placement in cards is aligned toward the top-left of the card body

## Collection View

- Kind: `View Component`
- Purpose: manage what belongs to the user's personal collection
- Composition:
- top-level section tabs for images, sayings, foci, and mindsets
- content area switches between collection sections
- State Ownership:
- active collection section is owned by `CompassStore` or equivalent top-level UI state
- section-specific selection and paging state may be owned by the section component unless promoted intentionally
- Data Scope:
- base library data for images and sayings
- collected items for foci and mindsets
- Interaction Rules:
- supports selecting items from the base library into the collection
- provides separate tabs for images, sayings, foci, and mindsets

### Collection Images Section

- Kind: `Content Component`
- Purpose: browse base images and rate them into the personal collection
- Composition:
- `CategoryFilter`
- `CardBrowser`
- State Ownership:
- current category index may be owned locally or by a section-level controller
- category filter enabled state may be owned locally or by a section-level controller
- selected image may be owned locally or by a section-level controller
- rating writes to collection-backed state
- Data Scope:
- browses all available images from `src/data/images.json`
- category names come from `src/data/categories.json`
- uses preview assets from `public/images/preview` in the grid
- Interaction Rules:
- `CategoryFilter` always shows the category at the current index
- the left and right buttons always change the current category index
- the middle button toggles whether category filtering is currently applied
- when category filtering is enabled, `CategoryFilter` filters the image set by the category at the current index
- when category filtering is disabled, the image set is shown without category filtering
- `CardBrowser` shows the selected image as a `CompassImageCard`
- preview items in the same browser are rendered as `PreviewCard` variants of `CompassImageCard`
- preview ratings in this browser are display-only
- rating an image adds it to the collection or updates its collected rating

### Collection Sayings Section

- Kind: `Content Component`
- Purpose: browse base sayings and rate them into the personal collection
- Composition:
- `CategoryFilter`
- `SayingsBrowser`
- State Ownership:
- current category index may be owned locally or by a section-level controller
- category filter enabled state may be owned locally or by a section-level controller
- selected saying may be owned locally or by a section-level controller
- rating writes to collection-backed state
- Data Scope:
- browses all available sayings from the base data
- category names come from `src/data/categories.json`
- Interaction Rules:
- `CategoryFilter` always shows the category at the current index
- the left and right buttons always change the current category index
- the middle button toggles whether category filtering is currently applied
- when category filtering is enabled, `CategoryFilter` filters the saying set by the category at the current index
- when category filtering is disabled, the saying set is shown without category filtering
- `SayingsBrowser` shows the selected saying and the available preview sayings
- rating a saying adds it to the collection and sets its rating
- Display Rules:
- the current UI uses a compact list instead of a large detail card

### Collection Foci Section

- Kind: `Content Component`
- Purpose: browse collected foci, inspect focus parts, and assemble focus candidates from collected items
- Composition:
- dedicated button row to toggle active browser mode
- 3 browser contexts:
- focus list browser
- image browser
- saying browser
- State Ownership:
- active browser mode may be owned locally or by a section-level controller
- selected focus, image, and saying may be owned locally or by a section-level controller
- persistence behavior must be made explicit by the implementation or worksheet when changed
- Data Scope:
- focus-related browsers operate only on collected items
- Interaction Rules:
- initially, the focus list browser is active
- the first button shows the focus list and allows the user to choose an existing focus
- after switching away from the focus list mode, 2 additional buttons become active
- one additional button shows image cards as `CompassImageCard` and `PreviewCard` variants
- one additional button shows saying cards
- the focus list browser shows collected foci as `FocusCard` and `PreviewCard` variants
- preview ratings in these browsers are display-only unless a workflow explicitly enables rating interaction there
- the image browser and saying browser are used to assemble or inspect focus parts
- allow rating existing collected foci
- Open Clarification:
- final save flow and finalized UX rules for focus creation are not fully defined yet

### Collection Mindsets Section

- Kind: `Content Component`
- Purpose: browse, draft, assign, and rate collection mindsets
- Composition:
- upper editor area for the active mindset
- lower area with 2 list modes:
- `Mindsets`
- `Foci`
- one `HorizontalBrowser` for existing collection mindsets
- one `HorizontalBrowser` for collected foci
- State Ownership:
- active editor draft may be local draft state or a store-backed draft, but this must be made explicit by implementation
- assigning foci into slots affects the currently active mindset draft
- Data Scope:
- mindset editing works only with collected foci
- existing mindset browsing uses `collection.mindsets`
- focus assignment browsing uses `collection.foci`
- Layout Rules:
- the upper area shows the active mindset
- the active mindset contains:
- a name field
- a `StarRating`
- up to 5 focus slots
- each focus slot can hold one focus from the collection
- existing mindsets are shown through a representative `PreviewCard` variant of one focus with the mindset name overlaid
- only one of the 2 lower `HorizontalBrowser` instances is active at a time
- Interaction Rules:
- in `Mindsets` mode, the user browses existing collection mindsets
- in `Foci` mode, the user browses collected foci through `FocusCard` or `PreviewCard` variants and assigns them into the currently active mindset slots
- a dedicated `+` tile creates a new mindset draft
- selecting an existing mindset loads it into the editor
- creating or editing a mindset works only with collected foci

## Navigator View

- Kind: `View Component`
- Status: not defined yet
- Purpose: reserved top-level view
- Non-Goals:
- no current behavior is defined

## Planned Editor Scope

### Focus Editor View

- Kind: `View Component`
- Status: planned, not finalized
- Purpose:
- join an image with a saying into a focus
- edit focus-level metadata
- later add a small editor for saying text presentation such as font size and text color
- State Ownership:
- not finalized
- Data Scope:
- expected to operate on collected images and collected sayings when formalized
- Current Note:
- focus preview and selection currently happen inside the `Collection` view under `Foci`
- Non-Goals:
- this view is not yet designed as a separate finalized screen
