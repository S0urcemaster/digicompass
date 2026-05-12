# Architecture

## Architecture Rule

- No local one-off components may be created inside other files
- Every UI element must be implemented as its own reusable component or as a derived component based on an existing component
- This rule also applies to views: every view is a component, not inline local composition

## Specification Rule For AI Runs

- The specification must preserve implementation-critical intent, not only domain intent or visual intent
- Assumptions that human implementers may treat as obvious must still be written explicitly when they affect structure, state ownership, data scope, composition, or interaction behavior
- Components must be classified explicitly as `Reusable Component`, `Content Component`, or `View Component`
- If a component is intended for one specific workflow only, that limitation must be stated explicitly
- If a component is intended for reuse across views, that reuse intent must be stated explicitly
- Architecturally relevant decisions should be written as explicit rules, not left as implied convention

## App Layout

- Portrait-first layout
- The app is narrow and primarily sized for smartphones
- On desktop, the app keeps the same aspect ratio and is framed by side margins
- By default, the main app components touch each other without outer gaps or spacing between component blocks

## App Shell

### Header

Vertical order:

- App title: `Digi Compass`
- Subtitle: `Mindsets for real situations`
- Primary tabs: `MainTab`

### MainTab

Available tabs:

- `Navigator`
- `Compass`
- `Collection`
