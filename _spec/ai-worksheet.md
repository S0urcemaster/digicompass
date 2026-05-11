# AI Worksheet

This file is the small working surface for the next implementation-oriented AI run. Update it as work advances so a later run can continue from the latest known state instead of the original raw plan.

## Current Work Packet

- Goal:
- establish a first runnable frontend implementation from the current spec baseline
- Scope:
- scaffold the frontend app and build tooling
- create explicit reusable, content, and view components instead of inline composition
- load source data from `frontend/src/data` and image assets from `frontend/public/images`
- provide a local-first store and initial flows for `Compass` and `Collection`
- Done When:
- the repo contains a runnable frontend app
- shared components, views, and store boundaries exist in code
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
- review whether `CardBrowser` paging and preview composition should be store-owned or local
- Done When:
- the two collection sections have explicit matching rules in code and spec

## Current State

- Spec structure has been upgraded to classify components explicitly.
- A first Vite/React/Zustand frontend scaffold now exists under `frontend/`.
- `Card` uses fixed header, middle, and footer regions with top-left text behavior.
- `StarButton` now exists as an explicit specialized component and `StarRating` distributes 5 stars across the available width.
- `Compass View` and all current `Collection View` sections exist as separate components.
- The build passes, but some workflow details are still only approximated.

## Known Drift

- `Collection > Foci` currently switches between the 3 browser contexts, but the transition rules are still looser than the view spec wording.
- `Collection > Mindsets` currently edits persisted store state directly; draft-vs-saved behavior is still underspecified.
- `CardBrowser` selection and paging are implemented locally per instance and may need stronger store coordination if the spec is tightened.
- The visual system is functional, but not yet refined against a finalized design pass.

## Misread Risks For A Fresh Run

- Do not treat `StarButton` as a spec-only naming detail. The current code still drifts here, and that drift is not considered close enough.
- Do not assume draft-vs-persisted behavior for `Collection > Foci` or `Collection > Mindsets` is already settled. If changed, make the behavior explicit in code and spec or worksheet notes.
- Do not treat partial browser/toggle similarity in `Collection > Foci` as automatically satisfying the current view spec. The structural composition still matters.

## Touched Files

- `frontend/index.html`
- `frontend/package.json`
- `frontend/tsconfig.app.json`
- `frontend/tsconfig.json`
- `frontend/vite.config.ts`
- `frontend/src/App.tsx`
- `frontend/src/components/Button.tsx`
- `frontend/src/components/Card.tsx`
- `frontend/src/components/CardBrowser.tsx`
- `frontend/src/components/CategoryFilter.tsx`
- `frontend/src/components/FocusCard.tsx`
- `frontend/src/components/FocusSlot.tsx`
- `frontend/src/components/HorizontalBrowser.tsx`
- `frontend/src/components/MainTab.tsx`
- `frontend/src/components/MindsetPaginator.tsx`
- `frontend/src/components/Paginator.tsx`
- `frontend/src/components/SayingsBrowser.tsx`
- `frontend/src/components/StarButton.tsx`
- `frontend/src/components/StarRating.tsx`
- `frontend/src/main.tsx`
- `frontend/src/store/compassStore.ts`
- `frontend/src/styles.css`
- `frontend/src/types/domain.ts`
- `frontend/src/utils/data.ts`
- `frontend/src/utils/factoryState.ts`
- `frontend/src/views/CollectionFociSection.tsx`
- `frontend/src/views/CollectionImagesSection.tsx`
- `frontend/src/views/CollectionMindsetsSection.tsx`
- `frontend/src/views/CollectionSayingsSection.tsx`
- `frontend/src/views/CollectionView.tsx`
- `frontend/src/views/CompassView.tsx`
- `frontend/src/views/NavigatorView.tsx`

## Open Decisions

- Decide whether mindset editing should use explicit draft objects instead of mutating persisted collection mindsets directly.
- Decide how strictly `Collection > Foci` should keep the 3-browser composition and activation sequencing described in `views.md`.

## Completed Recently

- Scaffolded the first runnable frontend implementation from the current spec.
- Added reusable component files for tabs, buttons, cards, rating, paginators, and browsers.
- Added a Zustand store with local persistence and dev-time factory reset behavior.

## Legacy Queue

- Navigator design
- standalone focus editor view
- small editor for saying text presentation such as font size and text color
