# AI Worksheet

This file is the small working surface for the next implementation-oriented AI run. Update it as work advances so a later run can continue from the latest known state instead of the original raw plan.

## Current Work Packet

- Goal:
- bring the card, rating, and browser implementation into closer alignment with the current spec
- Scope:
- update card text placement to top-left behavior from the spec
- introduce explicit `StarButton` implementation instead of treating star controls as generic buttons
- make `StarRating` span and distribute across the available footer width as specified
- review `CardBrowser` and saying/focus card rendering after those changes
- Done When:
- `Card`, `StarButton`, and `StarRating` match the current component spec
- the main card-based UI no longer relies on unchanged default button styling for star controls
- the build passes
- Out Of Scope:
- standalone `Navigator` definition
- final editor UX for focus or mindset editing

## Next Work Packet

- Goal:
- tighten `Collection > Foci` and `Collection > Mindsets` so they reflect the current view spec more strictly
- Scope:
- reduce drift between current implementation and view definitions
- clarify draft-vs-saved behavior in store or spec
- Done When:
- the two collection sections have explicit matching rules in code and spec

## Current State

- Spec structure has been upgraded to classify components explicitly.
- `Card` spec now uses fixed header and footer with remaining middle space.
- Card text behavior in the spec is top-left and uses stored `Saying.fontSize`.
- `StarRating` is specified as 5 `StarButton` elements distributed across available width.
- `views.md` now uses explicit view/component structure instead of only prose sections.
- The frontend scaffold, store, and first collection/compass flows exist, but some UI behavior still drifts from the latest spec decisions.

## Known Drift

- The current code still renders `StarRating` through generic `Button` instances and does not yet define an explicit `StarButton` component.
- Card body rendering in code is not yet fully aligned with the top-left text placement rule from the latest spec revision.
- `Collection > Foci` in code is looser than the currently specified 3-browser composition.
- `Collection > Mindsets` in code still leaves draft-vs-persisted behavior underspecified.

## Misread Risks For A Fresh Run

- Do not treat `StarButton` as a spec-only naming detail. The current code still drifts here, and that drift is not considered close enough.
- Do not assume draft-vs-persisted behavior for `Collection > Foci` or `Collection > Mindsets` is already settled. If changed, make the behavior explicit in code and spec or worksheet notes.
- Do not treat partial browser/toggle similarity in `Collection > Foci` as automatically satisfying the current view spec. The structural composition still matters.

## Touched Files

- `frontend/src/components/Button.tsx`
- `frontend/src/components/Card.tsx`
- `frontend/src/components/CardBrowser.tsx`
- `frontend/src/components/FocusCard.tsx`
- `frontend/src/components/HorizontalBrowser.tsx`
- `frontend/src/components/StarRating.tsx`
- `frontend/src/store/compassStore.ts`
- `frontend/src/styles.css`
- `frontend/src/views/CollectionFociSection.tsx`
- `frontend/src/views/CollectionMindsetsSection.tsx`
- `frontend/src/views/CollectionView.tsx`
- `frontend/src/views/CompassView.tsx`

## Open Decisions

- Decide whether `StarButton` should exist only as a visual specialization or as a separately named code component.
- Decide how strictly `Collection > Foci` should keep the 3-browser composition described in `views.md`.

## Completed Recently

- Rebuilt `_spec/components.md` into a structured AI-oriented component specification.
- Added architecture-level rules for explicit classification and implementation-critical intent.
- Refined the card spec around fixed header/footer and explicit text placement.

## Legacy Queue

- Navigator design
- standalone focus editor view
- small editor for saying text presentation such as font size and text color
