# Views

## Compass View

This is the main implemented view.

- It shows the currently selected focus of the currently selected mindset from `CompassStore`
- It is composed of a `MindsetPaginator`, a `CardBrowser`, and a `textarea`
- The `MindsetPaginator` switches the active mindset
- The `CardBrowser` displays the current focus as the selected card and the other focus options of the same mindset as preview cards
- Clicking a preview card changes the selected focus
- The `textarea` displays or edits the notes of the active mindset

Current implementation note:

- `image.color` matches the filename tone, and the saying text color in the views is rendered as the opposite tone

## Compass Layout Draft

- Vertical layout
- `MindsetPaginator` at the top
- `CardBrowser` below it
- `textarea` below the `CardBrowser`

## Collection View

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

## Navigator View

- Not defined yet

## Planned Editor Scope

### Focus Editor View

This view exists in store state and in the top-level navigation, but it is not yet designed as a separate screen.

Planned purpose:

- join an image with a saying into a focus
- edit focus-level metadata

Current note:

- focus preview and selection currently happen inside the `Collection` view under `Foci`
