# Components

## Button

- There is one shared base button class used throughout the application

## StarRating

- Horizontal row of 5 star buttons
- `StarRating` consists of 5 `StarButton` elements
- Used to assign the rating of the related element
- Stars can be configured as active or inactive without changing their visual shape
- `StarRating` distributes its 5 `StarButton` elements evenly across the available width

## StarButton

- Derived button component specialized for star rating
- Built from the shared `Button` base, but rendered as a star-specific control

## Card

- Abstract base for images or foci
- Aspect ratio: `5:7`
- Internal vertical layout has a fixed header and a fixed footer
- The text/content area in the middle takes the remaining vertical space between header and footer

Card area mapping:

- header: categories
- middle: saying text or other card content
- footer: `StarRating`

Width behavior:

- categories distribute themselves across the available card width
- `StarRating` distributes its stars across the available card width

Optional card content:

- assigned categories in the header area, visually aligned toward the top-left
- text content, when available, fills the remaining middle area
- saying text is aligned toward the top-left inside the middle area
- saying text uses the configured `Saying.fontSize` instead of automatic text fitting
- saying text is intended for a 3-line layout
- large and small card variants should scale from the same layout rules
- `StarRating` across the full width in the footer

Card sizes:

- `Selected Card`: `1/2` of content width
- `Preview Card`: `1/4` of content width

## CategoryFilter

- Horizontal row of 3 evenly distributed buttons
- Buttons:
- `<-` for previous category
- current category label
- `->` for next category
- The component sets the category filter of the connected list

## Paginator

- Always horizontal
- Child elements are distributed evenly across the available width

## CardBrowser

- Arrangement of cards or the concrete card subtypes for `CompassImage` or `Focus`
- Contains one `SelectedCard` in the top-left
- Contains 4 preview cards in a `2x2` block to the right of the selected card
- Contains 4 additional preview cards in one row below
- Clicking a preview card replaces the selected card

## SayingsBrowser

- A browser component for sayings derived from the same interaction model as `CardBrowser`
- It displays one selected saying and multiple preview sayings
- Clicking a preview saying replaces the selected saying
- It may use saying-specific subcomponents instead of image or focus cards

## MindsetPaginator

- Horizontal paginator for switching the active mindset
- Child elements are distributed evenly across the available width
- The component changes the active mindset in the connected store or parent state

## HorizontalBrowser

- A horizontal browser component for paged item lists
- Items are arranged in one horizontal row
- The browser is used for selectable lists of cards or tiles
- Paging controls belong to the browser
- Clicking an item selects it or assigns it, depending on the connected workflow
