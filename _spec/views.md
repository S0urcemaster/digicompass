# Views

Diese Datei beschreibt die uebergeordneten Views von Digi Compass.

Sie klaert, welche gleichberechtigten Hauptansichten das Produkt traegt und welche feste Mindestform fuer bereits definierte Views gilt.

## Leitfrage

Welche uebergeordneten Views sind im Produkt vorhanden, und welche davon sind bereits in ihrer Grundform festgelegt?

## Kernsatz

Digi Compass kennt aktuell drei uebergeordnete und gleichberechtigte Views:

1. `Mindset`
2. `Navigator`
3. `Collection`

Diese Views sind auf derselben Produktebene angesiedelt.

Die `Mindset`-View ist dabei zwar die primaere Startansicht, aber keine fachlich hoehere View als `Navigator` oder `Collection`.

## Top-Level-Views

### Mindset

- Rolle: aktuelle Hauptansicht fuer Orientierung aus gespeicherten Foci
- Position in der bevorzugten View-Anordnung: mittig
- bevorzugte Bedienform: als Tab in der Mitte

Die `Mindset`-View ist aktuell die am weitesten definierte View.

Sie zeigt mindestens:

- eine grosse aktive Focus-Karte
- vier kleinere Focus-Karten daneben

Dabei gilt:

- ein `Mindset` traegt hoechstens fuenf `Foci`
- die View repraesentiert diese Struktur als genau fuenf Kartenplaetze
- mindestens ein `Focus` wird fuer ein `Mindset` erwartet
- die grosse Karte ist doppelt so gross wie eine kleine Karte
- genau einer der vorhandenen `Foci` wird als grosse aktive Karte herausgestellt
- ein Klick auf eine kleine Karte tauscht diese in die grosse aktive Position
- die grosse Karte ist die aktuell fokussierte Karte innerhalb der View
- fehlende `Foci` bleiben als leere Plaetze sichtbar
- auf der grossen Karte kann die Bewertung eingestellt werden
- in dieser View schaltet ein erneuter Klick auf denselben Bewertungswert die Bewertung ausnahmsweise nicht ab
- auf der grossen Karte kann in eine Vollbildansicht der Karte umgeschaltet werden

Die `Mindset`-View liest ihre Karten aus dem aktuell gesetzten `Mindset`.

## Focus-Karten

`Focus` wird aktuell in zwei Darstellungen gezeigt:

1. `selected`
2. `preview`

Dabei gilt:

- die `selected`-Darstellung ist genau doppelt so gross wie eine `preview`
- `selected` ist die grosse aktive Fokusdarstellung
- `preview` ist die kleinere Vorschauvariante derselben Grundkomponente

## Kartenraster

Die Oberflaeche einer `Image`- oder `Focus`-Karte ist in fuenf Reihen gegliedert:

1. `header`
2. `content`
3. `content`
4. `content`
5. `footer`

Diese Gliederung bleibt in `selected` und `preview` erhalten.

## Header

Im `header` werden Kategorien angezeigt.

Dabei gilt:

- bei `Image` wird die Bildkategorie angezeigt
- bei `Saying` werden Saying-Kategorien angezeigt
- bei `Focus` wird die vereinigte Menge aus Saying-Kategorien und Image-Kategorie angezeigt
- Kategorien stammen aus `data/categories.json`
- die sichtbare Kategorienmenge wird auf hoechstens fuenf Eintraege reduziert
- die Schriftgroesse im `header` soll so gewaehlt werden, dass moeglichst fuenf Kategorien in den verfuegbaren Raum passen

## Content

Im mittleren `content`-Bereich wird der Saying-Text gezeigt.

Dabei gilt:

- der Text nutzt den verfuegbaren Raum moeglichst weitgehend aus
- die Texteigenschaften werden aus dem `Saying` bestimmt
- dazu gehoeren mindestens Schriftgroesse und Schriftfarbe
- weitere typografische Eigenschaften wie Dichte, Letter-Spacing oder Zeilenabstand duerfen fuer die konkrete Komponente angepasst werden, wenn dies der Lesbarkeit und dem Flaechennutzen dient
- fuer solche typografischen Schaerfungen kann spaeter eine eigene Editor- oder Zusatzfunktion hinzukommen

## Footer

Im `footer` wird die Bewertungskomponente angezeigt.

Dabei gilt:

- die Bewertung nutzt den verfuegbaren Platz moeglichst weitgehend aus
- in `selected` ist sie aktiv benutzbar, wenn die jeweilige View dies erlaubt
- in `preview` ist sie grundsaetzlich nur anzeigend, solange keine ausdrueckliche Bearbeitungsregel etwas anderes festlegt

## Kontrastregel

Jedes `Image` traegt einen Typ, ob es eher `hell`, `dunkel` oder `mix` ist.

Komponenten auf einer `Image`- oder `Focus`-Karte sollen im Kontrast zur Bildfarbe stehen.

Das gilt insbesondere fuer:

- Kategorien im `header`
- Saying-Text im `content`
- Bewertung im `footer`

### Navigator

- Rolle: gleichberechtigte Top-Level-View
- Position in der bevorzugten View-Anordnung: links
- Status: bisher fachlich noch nicht ausdefiniert

Der `Navigator` ist als eigener Hauptbereich gesetzt, auch wenn seine konkrete Funktion spaeter noch weiter geklaert wird.

### Collection

- Rolle: gleichberechtigte Top-Level-View fuer Sammlung, Auswahl und Aufbau des User-Pools
- Position in der bevorzugten View-Anordnung: rechts

Die `Collection` hat aktuell drei untergeordnete Views:

1. `Images`
2. `Sayings`
3. `Foci`

Die `Collection` traegt insbesondere:

- Auswahl von `Sayings`, `Images` und `Foci` aus dem Factory-Bestand
- Aufnahme dieser Einheiten in den User-Store
- Focus-Bildung aus User-Store-`Sayings` und User-Store-`Images`
- Verwaltung des User-Pools der persoenlich aufgenommenen Einheiten

### Collection Images

Die Unter-View `Images` zeigt `Images` aus dem Factory-Bestand.

Dort gilt:

- der Benutzer kann `Images` auswaehlen
- der Benutzer kann ausgewaehlte `Images` in den User-Store aufnehmen
- der Benutzer kann bereits aufgenommene `Images` wieder aus dem User-Store entfernen

### Collection Sayings

Die Unter-View `Sayings` zeigt `Sayings` aus dem Factory-Bestand.

Dort gilt:

- der Benutzer kann `Sayings` auswaehlen
- der Benutzer kann ausgewaehlte `Sayings` in den User-Store aufnehmen
- der Benutzer kann bereits aufgenommene `Sayings` wieder aus dem User-Store entfernen

### Collection Foci

Die Unter-View `Foci` traegt:

- einen Toggle-Schalter
- den Focus-Browser
- die beiden Editor-Tabs `Images` und `Sayings`

Dabei gilt:

- in der Fokusstellung zeigt der Toggle den Text `Edit -&gt;`
- in dieser Stellung wird die Focus-Liste angezeigt
- die Focus-Liste zeigt die `Foci` aus dem Factory-Bestand
- in diesem Zustand kann der Benutzer `Foci` in den User-Store aufnehmen oder aus ihm entfernen
- wird der Toggle aktiviert, wechselt die Unter-View in den Focus-Editor
- im aktiven Focus-Editor zeigt der Toggle den Text `&lt;- Foci`
- nur im aktiven Focus-Editor funktionieren `Images` und `Sayings` als Tabs fuer den User-Store
- diese beiden Tabs zeigen nur die `Images` und `Sayings`, die der Benutzer zuvor in `Collection > Images` und `Collection > Sayings` aufgenommen hat
- die dortige Auswahl bildet den aktuellen Focus-Editor
- genau ein Saying und genau ein Image ergeben in diesem Editor einen neuen `Focus`
- dieser neue `Focus` kann dem User-Store hinzugefuegt werden
- aktiviert der Benutzer `&lt;- Foci`, verlaesst er den Editor und kehrt zur Focus-Liste zurueck

## Startregel

Beim Oeffnen der App startet Digi Compass direkt in der `Mindset`-View.

Gezeigt wird dabei das zuletzt als aktuell gesetzte `Mindset`.

## Offene Entscheidungen

Die folgenden Punkte bleiben auf dieser Schicht sichtbar:

- welche konkrete Funktion der `Navigator` dauerhaft tragen soll
- wie die drei Top-Level-Views auf kleinen Smartphone-Flaechen konkret umgeschaltet werden
- wie der Focus-Editor innerhalb von `Collection > Foci` layoutseitig auf kleinen Flaechen angeordnet wird
