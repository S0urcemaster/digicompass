# Digi Compass

(Developer note : Mostly instructed AI project content)

Digi Compass ist ein System zum Aufbau persoenlicher Orientierung aus bedeutungstragenden Elementen.

Die fachliche Primaerquelle des Projekts ist die Spezifikation in [`/_spec/index.md`](./_spec/index.md).

## Produktkern

Die kleinste fachliche Einheit ist das `Element`.

Aktuell gibt es mindestens diese Element-Arten:

- `Saying`
- `Image`

Aus Elementen entstehen `Foci`.

Aus `Foci` entstehen `Mindsets`.

Die `Mindset`-Ansicht ist die primaere Hauptansicht des Produkts. Beim Oeffnen der App soll direkt das zuletzt als aktuell gesetzte Mindset erscheinen und lesbar machen, an welchen Spruch sich der Benutzer erinnern wollte.

## Basisdaten

Die aktuellen Basisdaten des Produkts liegen unter [`frontend/src/data`](./frontend/src/data):

- [`frontend/src/data/sayings.json`](./frontend/src/data/sayings.json)
- [`frontend/src/data/images.json`](./frontend/src/data/images.json)
- [`frontend/src/data/categories.json`](./frontend/src/data/categories.json)

`Sayings` und `Images` sind das aktuelle App-Kapital. Diese Bestaende koennen fortlaufend erweitert werden.

Fachlich gilt:

- die Datenquelle `sayings` wird durch die Entitaet `Saying` repraesentiert
- die Datenquelle `images` wird durch die Entitaet `Image` repraesentiert
- einzelne Eintraege aus diesen Bestaenden erscheinen im Produkt jeweils als eigene Elemente

Aus diesen Basisdaten kann der Benutzer eine lokale Auswahl treffen. Diese Benutzerauswahl wird lokal gespeichert und bildet den persoenlichen Arbeitsbestand fuer `Foci` und `Mindsets`.

## Bilddaten pflegen

Neue Bilder werden unter [`frontend/public/images`](./frontend/public/images) abgelegt.

Danach wird [`ops/rebuild-images-json.mjs`](./ops/rebuild-images-json.mjs) verwendet, um [`frontend/src/data/images.json`](./frontend/src/data/images.json) neu aufzubauen.

Das Skript:

- liest die vorhandenen Bilddateien aus `frontend/public/images`
- leitet `category` und `color` aus dem Dateinamen ab
- vergibt laufende `id`-Werte
- erhaelt vorhandene `rating`-Werte, wenn moeglich

Erwartetes Dateinamenschema:

```text
<kategorie> <farbe> <nummer>.<ext>
```

Beispiel:

```text
angst hell 2.jpg
```

## Entwicklerhinweise

- Die Spec ist die massgebliche Produktwahrheit. Vor fachlichen oder UI-nahen Aenderungen zuerst `/_spec/index.md` lesen.
- `Saying` und `Image` sind keine zufaelligen Seed-Daten, sondern die aktuellen fachlichen Basisbestaende des Produkts.
- Wenn neue Bilder hinzukommen, reicht das Ablegen in `frontend/public/images` nicht aus. Danach muss `ops/rebuild-images-json.mjs` ausgefuehrt werden, damit `images.json` konsistent bleibt.
- `categories.json` ist der aktuelle Kategorienbestand, der die vorhandenen Themenfelder abbildet.
- Die Repo-Struktur zeigt derzeit vor allem Spec, Daten und Assets. Wenn Laufzeit- oder Build-Struktur spaeter erweitert wird, sollte diese README entsprechend mitgezogen werden.
