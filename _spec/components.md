# Components

## Button

- There is one shared base button class used throughout the application

## StarRating

- Horizontal row of 5 star buttons
- Used to assign the rating of the related element
- Stars can be configured as active or inactive without changing their visual shape

## Card

- Abstract base for images or foci
- Aspect ratio: `5:7`
- Internal vertical layout is divided into 5 equal parts

Card area mapping:

- top `1/5`: categories
- middle `3/5`: saying text
- bottom `1/5`: `StarRating`

Width behavior:

- categories distribute themselves across the available card width
- `StarRating` distributes its stars across the available card width

Optional card content:

- assigned categories in the top area, visually aligned toward the top-left
- text content, when available, fills the middle `3/5` area
- saying text is intended for a 3-line layout
- saying text should be rendered as large as practical within that middle area
- large and small card variants should scale from the same layout rules
- `StarRating` across the full width at the bottom

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
