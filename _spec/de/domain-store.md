# Domäne und Store

## Domänenmodell

### DigiCompass

- username
- mindsets: `Mindset[]`
- collection: `Collection`

### Mindset

- name
- foci: `Focus[]`
- rating: `Rating`
- notes

Aktuelle Absicht:

- Ein Mindset soll aktuell auf 5 Foki begrenzt sein

### Focus

- saying: `Saying`
- image: `CompassImage`
- rating: `Rating`
- notes

### Saying

- id
- text
- fontSize
- categories: `string[]`
- rating: `Rating`

### CompassImage

- id
- url
- color
- category: `string`
- rating: `Rating`

Hinweise:

- `url` speichert nur den Bilddateinamen
- `color` speichert den Bildton aus dem Dateinamen wie `hell`, `dunkel` oder `mix`

### Category

- einfacher String

### Collection

- sayings: `Saying[]`
- images: `CompassImage[]`
- foci: `Focus[]`
- mindsets: `Mindset[]`

### Rating

- Dezimalzahl von `0` bis `1`

## Store-Form

Der persistierte `CompassStore` enthält Domänendaten und UI-State:

- `data: DigiCompass`
- `activeView: 'navigator' | 'compass' | 'collection'`
- `selectedMindsetIndex: number`
- `selectedFocusIndex: number`

Der Store unterstützt aktuell:

- Username ändern
- aktive Top-Level-View umschalten
- aktuelles Mindset auswählen
- aktuellen Fokus auswählen
- Mindsets hinzufügen, entfernen und aktualisieren
- Foki innerhalb eines Mindsets hinzufügen, entfernen und aktualisieren

## Frontend-Laufzeithinweise

### Local Storage

- Für neue Nutzer wird ein `CompassStore` auf Basis von `localStorage` erstellt
- Für wiederkehrende Nutzer wird der persistierte Store wiederverwendet
- Autosave erfolgt nach jeder Zustandsänderung über Zustand-Persistenz
- Im Entwicklungsmodus lädt die App bei Browser-Refresh `factoryState` neu, statt persistiertes `localStorage` wiederzuverwenden
