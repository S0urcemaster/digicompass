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

## Browser-Raster

Der `Image`-Browser, der `Saying`-Browser und der `Focus`-Browser folgen derselben Rasterlogik.

Dabei gilt:

- ein Browser zeigt genau ein grosses `selected`-Element
- ein Browser zeigt zusaetzlich genau acht kleinere `preview`-Elemente
- das Gesamtraster besteht aus vier Spalten und drei Zeilen in der Masseinheit einer kleinen Karte
- die grosse `selected`-Karte belegt links oben eine Flaeche von zwei Spalten und zwei Zeilen
- die acht `preview`-Karten belegen die verbleibenden Rasterfelder

Die Matrix lautet ausgeschrieben:

1. Zeile 1: `s | s | p | p`
2. Zeile 2: `s | s | p | p`
3. Zeile 3: `p | p | p | p`

Dabei bedeutet:

- `s` steht fuer `selected`
- `p` steht fuer `preview`

Die `preview`-Karten folgen dabei der verbleibenden Rasterordnung von rechts oben ueber rechts unten bis durch die untere Reihe.

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

- Rolle: gleichberechtigte Top-Level-View fuer Sammlung, Auswahl und Aufbau des persoenlichen Store
- Position in der bevorzugten View-Anordnung: rechts

Die `Collection` hat aktuell vier untergeordnete Views:

1. `Images`
2. `Sayings`
3. `Foci`
4. `Editor`

Die `Collection` traegt insbesondere:

- Auswahl von `Sayings`, `Images` und `Foci` aus dem Factory-Bestand
- Aufnahme dieser Einheiten in den persoenlichen Store
- Aufbau von `Foci` aus Store-`Sayings` und Store-`Images`
- Aufbau von `Mindsets` aus gespeicherten `Foci`
- Verwaltung des persoenlichen Store

### Collection Images

Die Unter-View `Images` zeigt `Images` aus dem Factory-Bestand.

Dort gilt:

- der `Image`-Browser ist in derselben Rasterlogik aufgebaut wie der `Focus`-Browser, jedoch ohne Saying-Inhalt
- genau ein `Image` wird als grosses `selected`-Element gezeigt
- genau acht weitere `Images` werden als kleinere `preview`-Elemente gezeigt
- der Benutzer kann `Images` auswaehlen
- der Benutzer kann ausgewaehlte `Images` in den Store aufnehmen
- der Benutzer kann bereits aufgenommene `Images` wieder aus dem Store entfernen

### Collection Sayings

Die Unter-View `Sayings` zeigt `Sayings` aus dem Factory-Bestand.

Dort gilt:

- der `Saying`-Browser folgt derselben Hochformat- und Rasterlogik wie der `Image`-Browser
- der `Saying`-Browser ist damit im Prinzip ein `Image`-Browser ohne Image
- genau ein `Saying` wird als grosses `selected`-Element gezeigt
- genau acht weitere `Sayings` werden als kleinere `preview`-Elemente gezeigt
- Kategorien und Bewertung bleiben in `selected` und `preview` sichtbar
- der Benutzer kann `Sayings` auswaehlen
- der Benutzer kann ausgewaehlte `Sayings` in den Store aufnehmen
- der Benutzer kann bereits aufgenommene `Sayings` wieder aus dem Store entfernen

### Collection Foci

Die Unter-View `Foci` zeigt `Foci` aus dem Factory-Bestand.

Dabei gilt:

- der `Focus`-Browser folgt derselben 4x3-Rasterlogik wie der `Image`-Browser
- genau ein `Focus` wird als grosses `selected`-Element gezeigt
- genau acht weitere `Foci` werden als kleinere `preview`-Elemente gezeigt
- der Benutzer kann `Foci` auswaehlen
- der Benutzer kann ausgewaehlte `Foci` in den Store aufnehmen
- der Benutzer kann bereits aufgenommene `Foci` wieder aus dem Store entfernen

### Collection Editor

Die Unter-View `Editor` ist der Ort, an dem neue orientierende Einheiten aktiv gebildet werden.

Sie ist kein untergeordnetes Restverhalten der Sammlung, sondern eine eigene produktive Arbeitszone innerhalb der `Collection`.

Der `Editor` hat aktuell zwei Tabs:

1. `Foci`
2. `Mindsets`

Der `Editor` ist fachlich ein besonders wichtiger Bereich des Produkts.

Hier entsteht der fuer Digi Compass zentrale Moment des Verbindens:

- im `Foci`-Editor werden Denken und Fuehlen durch Saying und Image zusammengefuehrt
- im `Mindsets`-Editor werden mehrere Foci zu groesserer Orientierung verbunden

### Collection Editor Foci

Der Tab `Foci` im `Editor` bildet neue `Foci` aus dem persoenlichen Store.

Dort gilt:

- die Eingaben stammen aus den zuvor in `Collection > Images` und `Collection > Sayings` aufgenommenen Store-Einheiten
- genau ein Saying und genau ein Image bilden die aktuelle Focus-Vorschau
- aus dieser Vorschau kann ein neuer `Focus` entstehen
- dieser neue `Focus` kann dem Store hinzugefuegt werden

### Collection Editor Mindsets

Der Tab `Mindsets` im `Editor` bildet neue `Mindsets` aus gespeicherten `Foci`.

Dort gilt:

- die Eingaben stammen aus den im Store vorhandenen `Foci`
- mehrere `Foci` koennen zu einem `Mindset` verbunden werden
- das entstehende `Mindset` kann dem Store hinzugefuegt werden

## Startregel

Beim Oeffnen der App startet Digi Compass direkt in der `Mindset`-View.

Gezeigt wird dabei das zuletzt als aktuell gesetzte `Mindset`.

## Offene Entscheidungen

Die folgenden Punkte bleiben auf dieser Schicht sichtbar:

- welche konkrete Funktion der `Navigator` dauerhaft tragen soll
- wie die drei Top-Level-Views auf kleinen Smartphone-Flaechen konkret umgeschaltet werden
- wie der `Editor` innerhalb von `Collection` layoutseitig auf kleinen Flaechen angeordnet wird
