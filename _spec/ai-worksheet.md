# AI Worksheet

This file is the small working surface for the next implementation-oriented AI run. Update it as work advances so a later run can continue from the latest known state instead of the original raw plan.

This worksheet is for one rebuild cycle only. The normal loop is:

- build the frontend from the current spec
- inspect the result
- improve the spec from what the build exposed
- wipe the frontend
- start the next rebuild from spec again

The spec is durable. The frontend implementation is disposable.

## Current Work Packet

- Goal:
- rebuild a runnable frontend implementation from the current spec baseline after the frontend wipe
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
- The frontend implementation has been intentionally wiped.
- `frontend/` currently contains source data and image assets, but not the runnable app scaffold.
- The next run should rebuild the app from spec instead of assuming surviving UI code.

## Known Drift

- The spec still leaves draft-vs-saved behavior in `Collection > Mindsets` open.
- `Collection > Foci` still leaves the save flow and some activation-sequencing details open.
- The rebuild will likely force more explicit decisions about browser-local state versus store-owned state.

## Misread Risks For A Fresh Run

- Do not treat the wiped frontend as accidental loss; it is part of the iteration model.
- Do not infer behavior from earlier implementation history when the current spec does not state it.
- Do not assume draft-vs-persisted behavior for `Collection > Foci` or `Collection > Mindsets` is already settled. If changed, make the behavior explicit in code and spec or worksheet notes.
- Do not treat partial browser/toggle similarity in `Collection > Foci` as automatically satisfying the current view spec. The structural composition still matters.

## Touched Files

- `frontend/src/data/categories.json`
- `frontend/src/data/images.json`
- `frontend/src/data/sayings.json`
- `frontend/public/images/**`
- `frontend/public/images/preview/**`

## Open Decisions

- Decide whether mindset editing should use explicit draft objects instead of mutating persisted collection mindsets directly.
- Decide how strictly `Collection > Foci` should keep the 3-browser composition and activation sequencing described in `views.md`.

## Completed Recently

- Reframed the spec and worksheet around the intended rebuild loop.
- Confirmed that the current cycle starts from a wiped frontend implementation.

## Legacy Queue

- Navigator design
- standalone focus editor view
- small editor for saying text presentation such as font size and text color
