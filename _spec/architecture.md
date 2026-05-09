# Architecture

## Architecture Rule

- No local one-off components may be created inside other files
- Every UI element must be implemented as its own reusable component or as a derived component based on an existing component
- This rule also applies to views: every view is a component, not inline local composition

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
