# Domain And Store

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

## Frontend Runtime Notes

### Local Storage

- For a new user, a localStorage-backed `CompassStore` is created
- For a returning user, the persisted store is reused
- Autosave happens through Zustand persistence after each state change
- In development mode, the app reloads `factoryState` on browser refresh instead of reusing persisted localStorage data
