# Implementation Notes

This file is the stable execution guide for implementation work. It should remain short and should not become a long-running mixed backlog.

## Purpose

- preserve the working mode for implementation-oriented AI runs
- define how tasks are packaged, advanced, and archived
- keep only durable guidance here
- move run-specific status into the current AI worksheet

## Working Mode

- Treat this spec as the primary source of truth for structure, behavior, and composition.
- Treat the frontend implementation as disposable proof of the current spec, not as the durable project artifact.
- The normal iteration loop is:
- improve the spec
- rebuild the frontend from the spec
- inspect the result against product intent
- feed discovered gaps or wrong assumptions back into the spec
- wipe implementation when starting the next clean rebuild cycle
- Treat `frontend/src/data/*.json` and `frontend/public/images/**` as source data, not UI implementation.
- Generate enough dummy user-store data for implementation runs to exercise the main flows.
- Target dummy store size:
- about 20 images
- about 30 sayings
- about 20 foci
- about 5 mindsets
- Prefer rebuilding thin, explicit components from the spec over preserving inconsistent legacy code.
- Follow the component rule strictly: no local one-off components inside other files.
- Build shared components first, then compose views from those components.
- Keep data loading, state transitions, and presentation separable.
- When the current implementation differs from the spec, update the spec first if the new behavior is intentional.
- Use the current implementation only as extraction material, not as a hard constraint.
- A missing or wiped frontend is not automatically a project problem; judge progress by whether the spec is strong enough to support the next rebuild.
- Defer `Navigator` until the existing collection and compass workflows are clean again.

## Task Packaging Rule

- Do not use one long active task list as the working interface for AI.
- Keep exactly one `Current Work Packet`.
- Keep at most one `Next Work Packet`.
- Keep broader future work in a short queue, not in the active packet.
- Each work packet must define:
- `Goal`
- `Scope`
- `Done When`
- `Out Of Scope`
- `Depends On`, when relevant
- Move completed packet items into `Completed`.
- Move obsolete or superseded notes into `Legacy Notes`.

## AI Worksheet Rule

- The current execution state for AI belongs in a separate worksheet file.
- The worksheet is updated after meaningful progress so the next run does not restart from the original raw list.
- The worksheet should be small enough that one run can track it without reconstructing the whole project history.
- The worksheet may contain status, current packet details, open decisions, and recently completed items, but it must describe the current rebuild cycle accurately.
- Do not let the worksheet imply that a wiped implementation still exists.
- When a rebuild starts from an empty frontend, say so explicitly.
- The worksheet should not replace the durable architectural or behavioral rules stored in the other spec files.

## Current Priorities

- Keep the JSON data model and image assets stable.
- Align implementation with the current component and architecture spec.
- Prefer explicit reusable/content/view component boundaries over ad-hoc composition.
- Clean up card, rating, and browser behavior before expanding editor scope.

## Current Worksheet

- Active worksheet: [ai-worksheet.md](./ai-worksheet.md)

## Legacy Notes

- Earlier versions of this file mixed status tracking, backlog items, implementation history, and current work into one place.
- That format is intentionally replaced by `implementation-notes.md` plus `ai-worksheet.md`.
