# Views

## Compass View

Dies ist die hauptsächlich umgesetzte View.

- Sie zeigt den aktuell ausgewählten Fokus des aktuell ausgewählten Mindsets aus dem `CompassStore`
- Sie besteht aus `MindsetPaginator`, `CardBrowser` und einem `textarea`
- Der `MindsetPaginator` schaltet das aktive Mindset um
- Der `CardBrowser` zeigt den aktuellen Fokus als ausgewählte Card und die übrigen Fokus-Optionen desselben Mindsets als Preview-Cards
- Ein Klick auf eine Preview-Card ändert den ausgewählten Fokus
- Das `textarea` zeigt die Notizen des aktiven Mindsets an oder bearbeitet sie

Aktueller Implementierungshinweis:

- `image.color` entspricht dem Ton aus dem Dateinamen, und die Textfarbe des Spruchs wird in den Views im jeweils entgegengesetzten Ton gerendert

## Compass Layout Draft

- Vertikales Layout
- `MindsetPaginator` oben
- `CardBrowser` darunter
- `textarea` unter dem `CardBrowser`

## Collection View

### Überblick

- Verwalten, was zur persönlichen Sammlung des Nutzers gehört
- Ausgewählte Elemente aus der Basisbibliothek in die Sammlung übernehmen
- Separate Tabs für Bilder, Sprüche, Foki und Mindsets bereitstellen

### Images

- Alle verfügbaren Bilder aus `src/data/images.json` durchsuchen
- Sie besteht aus `CategoryFilter` und `CardBrowser`
- Der `CategoryFilter` filtert die Bildmenge nach Kategorie
- Der `CardBrowser` zeigt das ausgewählte Bild und die paginierten Preview-Bilder
- In der Grid-Ansicht Preview-Assets aus `public/images/preview` verwenden

### Sayings

- Alle verfügbaren Sprüche aus den Basisdaten durchsuchen
- Sie besteht aus `CategoryFilter` und `SayingsBrowser`
- Der `CategoryFilter` filtert die Spruchmenge nach Kategorie
- Der `SayingsBrowser` zeigt den ausgewählten Spruch und die verfügbaren Preview-Sprüche
- Das Bewerten eines Spruchs fügt ihn der Sammlung hinzu und setzt seine Bewertung
- Die aktuelle UI verwendet eine kompakte Liste statt einer großen Detail-Card

### Foci

- Sie besteht aus 3 `CardBrowser`-Komponenten und einer dedizierten Button-Reihe zum Umschalten
- Die Button-Reihe schaltet um, welcher `CardBrowser` aktuell aktiv ist
- Anfangs ist der Fokuslisten-Browser aktiv
- Der erste Button zeigt die Fokusliste und erlaubt dem Nutzer, einen bestehenden Fokus auszuwählen
- Nach dem Wegschalten aus dem Fokuslisten-Modus werden 2 zusätzliche Buttons aktiv
- Ein zusätzlicher Button zeigt Bild-Cards
- Ein zusätzlicher Button zeigt Spruch-Cards
- Bild-Browser und Spruch-Browser werden verwendet, um Fokus-Bausteine zusammenzustellen oder zu prüfen
- Die fokusbezogenen Browser arbeiten nur mit gesammelten Elementen
- Das Bewerten bestehender gesammelter Foki ist erlaubt

### Mindsets

- Der obere Bereich zeigt das aktive Mindset
- Das aktive Mindset enthält:
- ein Namensfeld
- ein `StarRating`
- bis zu 5 Fokus-Slots
- Jeder Fokus-Slot kann einen Fokus aus der Sammlung aufnehmen
- Bestehende Mindsets werden über eine repräsentative Fokus-Preview mit überlagertem Mindset-Namen dargestellt
- Der untere Bereich schaltet zwischen 2 Listenmodi:
- `Mindsets`
- `Foci`
- Der untere Bereich enthält 2 `HorizontalBrowser`-Instanzen
- Eine `HorizontalBrowser`-Instanz ist für bestehende Sammlung-Mindsets
- Eine `HorizontalBrowser`-Instanz ist für gesammelte Foki
- Es ist immer nur eine dieser 2 `HorizontalBrowser`-Instanzen gleichzeitig aktiv
- Im Modus `Mindsets` durchsucht der Nutzer bestehende Sammlung-Mindsets
- Im Modus `Foci` durchsucht der Nutzer gesammelte Foki und weist sie den aktuell aktiven Mindset-Slots zu
- Ein dediziertes `+`-Tile erzeugt einen neuen Mindset-Entwurf
- Das Auswählen eines bestehenden Mindsets lädt es in den Editor
- Das Erstellen oder Bearbeiten eines Mindsets arbeitet nur mit gesammelten Foki

## Navigator View

- Noch nicht definiert

## Geplanter Editor-Bereich

### Focus Editor View

Diese View existiert im Store-State und in der Top-Level-Navigation, ist aber noch nicht als eigener Screen entworfen.

Geplanter Zweck:

- ein Bild mit einem Spruch zu einem Fokus verbinden
- Fokus-Metadaten bearbeiten

Aktueller Hinweis:

- Fokus-Preview und Auswahl finden aktuell innerhalb von `Collection > Foci` statt
