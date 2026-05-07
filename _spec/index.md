# Digi Compass Agent Specification

Digi Compass is a web application for building personal mindset collections from short sayings paired with images

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

- focus preview and selection currently happen inside the `Collection` view under `Fokusse`

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

### Fokusse

- Browse collected foci and filter them by category text
- Show a large focus preview with saying and image combined
- Allow rating existing collected foci
- Allow assembling a focus preview from collected images and collected sayings only
- A dedicated save/create flow for new foci is still pending

### Mindsets

- Pending



## Layout und Komponenten

Hochformat . Die App ist schmal und passt am besten für Smartphones . Auf dem Desktop hat sie dasselbe Seitenverhältnis mit entsprechenden Seitenrändern
Grundsätzlich gibt es keine Ränder oder Zwischenräume zwischen den unten definierten App- Komponenten

### Komponenten



#### Button

Es gibt eine Basisklasse für Buttons / die überall verwendet wird


#### StarRating

Horizontale Anordnung von 5 Buttons mit Stern -Zeichen / mit denen die Bewertung des zugeordneten Elements gemacht werden kann
Die Sterne sind konfigurierbar aktiv oder inaktiv / ohne ihr aussehen zu verändern


#### Card (abstract)

Eine Karte wird verwendet für Bilder oder Fokusse . Seitenformat 5:7
Eigenschaften (je optional) : Anzeige
- der zugeordneten Kategorien von oben links
- eines Textes (wenn verfügbar) / möglichst groß im mittleren Bereich
- StarRating Komponente unten auf der ganzen Breite

Cards gibt es in 2 Größen :

- Selected Card : 1/2 Contentbreite
- Preview Card  : 1/4 Contentbreite

#### CategoryPaginator

3 Buttons in horizontaler Anordnung / gleiche Verteilung :
- "<-" (vorheriges Element)
- CurrentCategory
- "->" (nächstes Element)

Die Komponente setzt den Kategoriefilter der Angebundenen Liste


#### Paginator

Paginators sind immer horizontal . Inhaltselemente sind gleich über die Breite verteilt


#### CardBrowser

Eine Anordnung von Cards bzw deren Subkomponenten CompassImage oder Fokus
Es enthält eine SelectedCard links oben mit einer umlaufenden Liste von 4 Preview Cards (row2x2col) rechts und 4 weiteren unten (row1x4col)
Die SelectedCard kann durch Klick auf eine PreviewCard geändert werden


### Singleton Komponenten

#### MainTab

- "Navigator" | "Kompass" | "Sammlung"


### Header

Vertikal angeordnet je Zeile :

- App title : "Digi Compass"
- Subtitle : "Mindsets für reale Situationen"
- Primary Tabs : MainTab Komponente

### Primary Tabs

#### Navigator

- noch nicht bestimmt


#### Kompass

Vertikale Anordnung :

- Horizontaler Paginator / Filter für Category

#### Sammlung


## Functions

### Primary Tabs

#### Navigator

#### Kompass

#### Sammlung



Users browse a base library of sayings and images, add selected items to their own collection, combine collected sayings and collected images into foci, group collected foci into mindsets, and rate or annotate the result.

## Project Structure

- `_spec/`: This specification
- `frontend/`: Web frontend
- `frontend/src/data` : Sayings, Categories and Images references

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
- categories: string[]
- rating: Rating

### CompassImage

- id
- url
- color
- category: string
- rating: Rating

`color` stores the image tone from the filename such as `hell`, `dunkel`, `mix`

### Category

- plain string

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

The persisted CompassStore contains both domain data and UI state:

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
- Change image category
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



## Implementation

Implement the next planned task . When finished : put the planned task to the closed tasks section and put the next task in open tasks to the planned tasks section


### Planned Tasks

- Propose the frontend toolchain (framework, state management, styling, and test setup), then implement it


### Open Tasks

- Ensure data files are present and consistent with the spec
- Set up `/frontend` with the chosen toolchain and base project structure.
- Update the model description in _spec/index.md with my changes in domain.ts
- Update compassStore with the _spec and domain.ts changes . Leave the factoryMindsets alone for now
- Redesing the frontend towards the new "## Frontend" -section in _spec/index.md
- Write to the spec that a user always works on his collection / never on the whole data - so Foci are created from images/sayings the user must previously choose into his collection . Mindsets also only use Foci from the collection
- Update the images.ts data with the updated files in public/images . use opposite text color to file name
- Create a factory collection in store/factoryState.ts : 20 sayings, 20 images, 10 Foci and 3 mindsets . make random combinations and dont stick to categories right now as I will hand-taylor that later . This will be the dummy data for the next task
- Implement the "## Collection view" / Images section of the spec


### Finished Tasks
