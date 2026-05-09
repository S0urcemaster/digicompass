# Überblick

## Produkt

Digi Compass ist eine Webanwendung zum Aufbau persönlicher Mindset-Sammlungen aus kurzen Sprüchen in Kombination mit Bildern.

Nutzer durchsuchen eine Basisbibliothek aus Sprüchen und Bildern, übernehmen ausgewählte Elemente in ihre eigene Sammlung, kombinieren gesammelte Sprüche und gesammelte Bilder zu Foki, gruppieren gesammelte Foki zu Mindsets und bewerten oder kommentieren das Ergebnis.

## Aktueller Produktkern

- Der Nutzer arbeitet immer in seiner persönlichen Sammlung und nie direkt in der gesamten Basisbibliothek, wenn höherwertige Objekte erstellt werden.
- Ein Fokus darf nur aus einem Spruch erstellt werden, der bereits in `collection.sayings` vorhanden ist.
- Ein Fokus darf nur aus einem Bild erstellt werden, das bereits in `collection.images` vorhanden ist.
- Ein Mindset darf nur aus Foki erstellt werden, die bereits in `collection.foci` vorhanden sind.
- `collection.mindsets` enthält nur Mindsets, die aus gesammelten Foki zusammengesetzt wurden.

## Top-Level-Views

Es ist immer nur eine Top-Level-View gleichzeitig aktiv:

- `navigator`
- `compass`
- `collection`

## Datenquellen

- `frontend/src/data`: Sprüche, Kategorien und Bildreferenzen
- `frontend/public/images`: große Bild-Assets
- `frontend/public/images/preview`: Preview-Bild-Assets

## Projektstruktur

- `_spec/`: Spezifikationsdateien
- `frontend/`: Web-Frontend
