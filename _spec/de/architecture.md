# Architektur

## Architekturregel

- Jedes UI Element ist als Komponente generalisiert und wird wiederverwendet wo möglich
- Wo keine Generalisierung möglich ist : wird eine Ableitung erzeugt
- Es gibt Content- Komponenten für Komposition - und wiederverwendbare Komponenten
- Wiederverwendbare Komponenten sind hierarchisch gegliedert

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

