# Implementation Notes

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

## Rebuild Order

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

## Current Build Priorities

- Keep the JSON data model and image assets stable
- Align `compassStore` and domain types with the current spec
- Rebuild collection-related browsers from reusable shared components
- Preserve the current visual structure where the spec already defines it
- Defer `Navigator` until the existing collection and compass workflows are clean again

## Working Rule For Open Tasks

- Keep only the next genuinely actionable items in the active task list
- Move completed items to `Finished Tasks`
- Move obsolete or already-covered items into a legacy subsection instead of mixing them with active tasks

## Planned Tasks

- Complete the first reusable component drafts from the current spec
- Align the remaining implementation with the JSON-based data model

## Open Tasks

- Update the remaining implementation from category objects to string categories
- Update the remaining implementation from image category lists to single image categories
- Replace remaining TypeScript data imports with JSON-based loading or adapters
- Extract the first reusable component set from the existing views
- Rebuild `Compass View` from `MindsetPaginator`, `CardBrowser`, and `textarea`
- Rebuild `Collection View` sections from the currently specified browser components

## Finished Tasks

- Restructured `_spec/index.md` so the active specification is at the top and legacy material is separated below
- Converted data files from TypeScript data modules to JSON
- Reduced categories to plain strings
- Reduced image category data to a single category field
- Updated major parts of the spec to match the current implementation behavior
