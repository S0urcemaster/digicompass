# Architektur

## Architekturregel

- Es dürfen keine lokalen Einweg-Komponenten innerhalb anderer Dateien erstellt werden
- Jedes UI-Element muss als eigene wiederverwendbare Komponente oder als abgeleitete Komponente auf Basis einer bestehenden Komponente umgesetzt werden
- Diese Regel gilt auch für Views: jede View ist eine Komponente und keine lokale Inline-Komposition

## App-Layout

- Portrait-first-Layout
- Die App ist schmal und primär für Smartphones dimensioniert
- Auf Desktop behält die App dasselbe Seitenverhältnis und wird durch seitliche Ränder gerahmt
- Standardmäßig berühren sich die Hauptkomponenten der App ohne äußere Abstände oder Lücken zwischen den Komponentenblöcken

## App-Shell

### Header

Vertikale Reihenfolge:

- App-Titel: `Digi Compass`
- Untertitel: `Mindsets for real situations`
- Primäre Tabs: `MainTab`

### MainTab

Verfügbare Tabs:

- `Navigator`
- `Compass`
- `Collection`
