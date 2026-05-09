# Komponenten

## Button

- Es gibt eine gemeinsame Basis-Button-Klasse, die in der gesamten Anwendung verwendet wird

## StarButton:Button

## StarRating

- Horizontale Reihe aus 5 Stern-Buttons
- Wird verwendet, um die Bewertung des jeweiligen Elements zu vergeben
- Sterne können als aktiv oder inaktiv konfiguriert werden, ohne ihre visuelle Form zu verändern

## Card

- Abstrakte Basis für Bilder oder Foki
- Seitenverhältnis: `5:7`
- Das interne vertikale Layout ist in 5 gleich große Teile gegliedert

Zuordnung der Card-Bereiche:

- oberes `1/5`: Kategorien
- mittleres `3/5`: Spruchtext
- unteres `1/5`: `StarRating`

Breitenverhalten:

- Kategorien verteilen sich über die verfügbare Breite der Card
- `StarRating` verteilt seine Sterne über die verfügbare Breite der Card

Optionaler Card-Inhalt:

- zugewiesene Kategorien im oberen Bereich, visuell nach oben links ausgerichtet
- Textinhalt füllt, sofern vorhanden, den mittleren `3/5`-Bereich
- der Spruchtext ist für ein 3-Zeilen-Layout gedacht
- der Spruchtext soll innerhalb dieses mittleren Bereichs so groß wie möglich dargestellt werden
- große und kleine Card-Varianten sollen aus denselben Layoutregeln skalieren
- `StarRating` über die volle Breite am unteren Rand

Card-Größen:

- `Selected Card`: `1/2` der Inhaltsbreite
- `Preview Card`: `1/4` der Inhaltsbreite

## CategoryFilter

- Horizontale Reihe aus 3 gleichmäßig verteilten Buttons
- Buttons:
- `<-` für die vorherige Kategorie
- aktuelles Kategorien-Label
- `->` für die nächste Kategorie
- Die Komponente setzt den Kategorienfilter der verbundenen Liste

## Paginator

- Immer horizontal
- Kindelemente verteilen sich gleichmäßig über die verfügbare Breite

## CardBrowser

- Anordnung von Cards oder konkreten Card-Untertypen für `CompassImage` oder `Focus`
- Enthält oben links eine `SelectedCard`
- Enthält rechts daneben 4 Preview-Cards in einem `2x2`-Block
- Enthält darunter 4 zusätzliche Preview-Cards in einer Reihe
- Ein Klick auf eine Preview-Card ersetzt die ausgewählte Card

## SayingsBrowser

- Eine Browser-Komponente für Sprüche, abgeleitet aus demselben Interaktionsmodell wie `CardBrowser`
- Sie zeigt einen ausgewählten Spruch und mehrere Preview-Sprüche
- Ein Klick auf einen Preview-Spruch ersetzt den ausgewählten Spruch
- Sie kann spruch-spezifische Unterkomponenten statt Bild- oder Fokus-Cards verwenden

## MindsetPaginator

- Horizontaler Paginator zum Umschalten des aktiven Mindsets
- Kindelemente verteilen sich gleichmäßig über die verfügbare Breite
- Die Komponente ändert das aktive Mindset im verbundenen Store oder im Parent-State

## HorizontalBrowser

- Eine horizontale Browser-Komponente für paginierte Elementlisten
- Elemente sind in einer horizontalen Reihe angeordnet
- Der Browser wird für auswählbare Listen aus Cards oder Tiles verwendet
- Paging-Steuerung gehört zum Browser
- Ein Klick auf ein Element wählt es aus oder weist es zu, abhängig vom verbundenen Workflow
