# Components

This file defines reusable and content-level UI components. Every component entry should state only the decisions that matter for implementation, but those decisions must be explicit.

## Button

- Kind: `Reusable Component`
- Purpose: shared base button component for interaction across the application
- Reuse Intent: base component for other buttons and button-derived controls
- Composition: no required child components
- State Ownership: stateless; receives interaction state from props or parent
- Layout Rules:
- shared base button class used throughout the application
- may be visually specialized by derived components
- Non-Goals:
- does not define the final appearance of all derived button components

## StarButton

- Kind: `Reusable Component`
- Purpose: specialized button for one star in a rating row
- Reuse Intent: used by `StarRating`; not intended as a general application button
- Composition:
- derived from `Button`
- rendered as a star-specific control
- State Ownership: stateless; active or inactive state is provided by parent
- Layout Rules:
- visual shape remains star-specific in active and inactive states
- Non-Goals:
- not rendered as an unchanged default `Button`

## StarRating

- Kind: `Reusable Component`
- Purpose: assign a rating to the related element
- Reuse Intent: reusable rating control for sayings, images, foci, and mindsets where needed
- Composition:
- horizontal row of 5 `StarButton` elements
- State Ownership: stateless; current rating value and interaction mode are provided by parent or store-connected wrapper
- Layout Rules:
- distributes its 5 `StarButton` elements evenly across the available width
- remains a horizontal row
- Interaction Rules:
- when interaction is enabled, selecting a star assigns the related rating value
- when interaction is disabled, the current rating is shown but selecting a star does not change the related value
- stars can be configured as active or inactive without changing their visual shape

## Card

- Kind: `Reusable Component`
- Purpose: abstract base card for images, foci, or other card-based content
- Reuse Intent: base layout for concrete card variants
- Composition:
- header area
- middle content area
- footer area
- may include categories in the header
- may include text or other content in the middle
- footer contains `StarRating`
- State Ownership: stateless; content and rating are supplied from parent or store-connected wrapper
- Layout Rules:
- aspect ratio: `5:7`
- internal vertical layout has a fixed header and a fixed footer
- the text/content area in the middle takes the remaining vertical space between header and footer
- categories distribute themselves across the available card width
- `StarRating` distributes its stars across the available card width
- header content is visually aligned toward the top-left
- text content fills the remaining middle area
- text in the middle area is aligned toward the top-left
- `StarRating` spans the full footer width
- Data Rules:
- saying text uses the configured `Saying.fontSize` instead of automatic text fitting
- saying text is intended for a 3-line layout
- large and small card variants scale from the same layout rules
- Card Sizes:
- `Selected Card`: `1/2` of content width
- `Preview Card`: `1/4` of content width
- Non-Goals:
- no automatic layout-based text size fitting

## PreviewCard

- Kind: `Reusable Component`
- Purpose: render the preview-sized card variant used inside preview areas of `CardBrowser`
- Reuse Intent: reusable preview wrapper for concrete card variants such as `CompassImageCard` and `FocusCard`
- Composition:
- derived from `Card`
- uses the `Preview Card` size rules from `Card`
- footer still contains `StarRating`
- State Ownership: stateless; content, rating, and rating interaction mode are supplied from parent or store-connected wrapper
- Layout Rules:
- uses the preview-size card layout from `Card`
- keeps the same header, middle, and footer structure as `Card`
- preview space is intentionally tighter than the selected card space
- preview text layout may require explicit manual adjustment by the concrete card variant when usual saying font sizes do not fit cleanly
- Interaction Rules:
- may be configured either as rating-display-only or rating-interactive depending on the connected workflow

## CompassImageCard

- Kind: `Content Component`
- Purpose: render one `CompassImage` as a concrete card variant
- Reuse Intent: used for image browsing in collection or other image-based workflows
- Composition:
- derived from `Card` or `PreviewCard`, depending on the current browser context
- shows the image asset from `CompassImage.url`
- footer contains `StarRating`
- State Ownership: stateless; image content, rating, and rating interaction mode are supplied from parent or store-connected wrapper
- Data Rules:
- full-size rendering uses assets from `frontend/public/images`
- preview rendering uses assets from `frontend/public/images/preview`
- the image tone comes from `CompassImage.color`
- Layout Rules:
- uses the image itself as the visual base of the card
- if category text is shown, it follows the shared card header rules
- Interaction Rules:
- when used as a preview card, selection behavior belongs to the surrounding browser

## FocusCard

- Kind: `Content Component`
- Purpose: render one `Focus` as a concrete card variant
- Reuse Intent: used for focus browsing in `Compass View`, `Collection > Foci`, and mindset-related workflows
- Composition:
- derived from `Card` or `PreviewCard`, depending on the current browser context
- shows the focus image from `Focus.image`
- shows the focus saying from `Focus.saying`
- footer contains `StarRating`
- State Ownership: stateless; focus content, rating, and rating interaction mode are supplied from parent or store-connected wrapper
- Data Rules:
- saying text uses `Focus.saying.fontSize`
- saying text color follows the opposite-tone rule derived from `Focus.image.color`
- Layout Rules:
- uses the focus image as the visual base of the card
- saying text remains aligned toward the top-left of the middle card area
- preview rendering inherits the tighter text constraints of `PreviewCard`
- Interaction Rules:
- when used as a preview card, selection behavior belongs to the surrounding browser

## CategoryFilter

- Kind: `Reusable Component`
- Purpose: toggle the connected category filter on or off and change the current category for a connected list
- Reuse Intent: reusable filter control for image and saying browser sections
- Composition:
- horizontal row of 3 buttons
- previous category button: `<-`
- current category toggle button
- next category button: `->`
- Data Rules:
- category names always come from `frontend/src/data/categories.json`
- the category list is static and is not created dynamically from the currently visible items
- State Ownership:
- current category index is owned by parent or connected store
- filter enabled state is owned by parent or connected store
- the component itself does not own the category list
- Layout Rules:
- horizontal row of 3 evenly distributed buttons
- the middle button always shows the category at the current index
- the shown category does not depend on whether the filter is enabled
- Interaction Rules:
- previous button moves to the previous category index
- next button moves to the next category index
- previous and next remain active even when the filter is disabled
- middle button toggles the connected category filter on or off
- when the filter is enabled, the connected list is filtered by the category at the current index
- when the filter is disabled, the connected list is shown without category filtering

## Paginator

- Kind: `Reusable Component`
- Purpose: switch between pages in a paged item set
- Reuse Intent: reusable paging control for browsers and list components
- Composition: horizontal control row with page actions and current position display as needed
- State Ownership: current page is owned by parent or connected component
- Layout Rules:
- always horizontal
- child elements are distributed evenly across the available width

## CardBrowser

- Kind: `Reusable Component`
- Purpose: browse a paged set of card-like items while keeping one selected item prominent
- Reuse Intent: reusable browser for `CompassImage`, `Focus`, or concrete card-derived item sets
- Composition:
- one `SelectedCard` in the top-left
- 4 preview cards in a `2x2` block to the right of the selected card
- 4 additional preview cards in one row below
- includes paging behavior for preview sets
- State Ownership:
- selected item is owned by parent or connected store
- current browser page may be owned internally or by parent
- Layout Rules:
- uses card-based arrangement rather than a plain list
- preview cards replace the selected card when chosen
- Interaction Rules:
- clicking a preview card replaces the selected card

## SayingsBrowser

- Kind: `Content Component`
- Purpose: browse sayings with one selected saying and multiple preview sayings
- Reuse Intent: saying-specific browser derived from the interaction model of `CardBrowser`
- Composition:
- one selected saying view
- multiple preview saying views
- may use saying-specific subcomponents instead of image or focus cards
- State Ownership:
- selected saying is owned by parent or connected store
- browser page may be owned internally or by parent
- Layout Rules:
- follows the same selection-and-preview interaction model as `CardBrowser`
- Interaction Rules:
- clicking a preview saying replaces the selected saying

## MindsetPaginator

- Kind: `Reusable Component`
- Purpose: switch the active mindset
- Reuse Intent: reusable mindset-switching control for `Compass View` or other mindset contexts
- Composition: horizontal row of mindset selection elements
- State Ownership: active mindset is owned by the connected store or parent state
- Layout Rules:
- horizontal paginator
- child elements are distributed evenly across the available width
- Interaction Rules:
- changes the active mindset in the connected store or parent state

## HorizontalBrowser

- Kind: `Reusable Component`
- Purpose: browse selectable items arranged in one horizontal row with paging
- Reuse Intent: reusable browser for card tiles, focus tiles, mindset tiles, or similar item rows
- Composition:
- horizontal item row
- paging controls belong to the browser
- State Ownership:
- selected or assigned item is determined by the connected workflow
- current browser page may be owned internally or by parent
- Layout Rules:
- items are arranged in one horizontal row
- used for selectable lists of cards or tiles
- Interaction Rules:
- clicking an item selects it or assigns it, depending on the connected workflow
