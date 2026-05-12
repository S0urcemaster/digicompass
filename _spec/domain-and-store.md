# Domain And Store

Diese Datei beschreibt die datengetragene Produktform von Digi Compass.

Sie klaert, welche fachlichen Entitaeten im Datenmodell getragen werden, welche Daten in den User-Store uebernommen werden und welcher UI-Zustand aus Daten sichtbar gemacht wird.

## Leitfrage

Welche fachlichen Daten repraesentieren das Produkt, und welcher minimale UI-Zustand wird aus diesen Daten heraus gelesen?

## Kernsatz

Die UI von Digi Compass wird durch fachliche Daten und einen kleinen aktuellen UI-Zustand repraesentiert.

Es wandern nur Daten.

Die UI fuehrt keine davon getrennten reichhaltigen Produktobjekte ein, sondern macht vorhandene Daten, Auswahlen, Vorschauen und gespeicherte Verbindungen sichtbar.

Zwischen Basisdaten und User-Store wird dabei keine garantierte Konsistenz vorausgesetzt.

## Grundunterscheidung

Digi Compass unterscheidet datenlogisch mindestens diese Bereiche:

1. Basisdaten
2. User-Pool
3. Mindset-Pool
4. aktueller UI-Zustand

## Basisdaten

Die Basisdaten sind der gewachsene Ausgangsbestand des Produkts:

- `Sayings`
- `Images`

Diese Daten werden durch die gleich benannten Entitaeten `Saying` und `Image` repraesentiert.

Sie bilden den Factory-Bestand, aus dem der Benutzer fuer seine eigene Orientierung auswaehlt.

## User-Pool

Der User-Pool enthaelt die vom Benutzer gebildeten und lokal gespeicherten `Foci`.

Ein `Focus` entsteht nicht dadurch, dass ganze UI-Objekte verschoben werden.

Ein `Focus` entsteht datenlogisch dadurch, dass die fuer den Focus benoetigten Daten aus dem Basisbestand in den User-Store uebernommen werden.

Dazu gehoeren mindestens:

- das gewaehlte `Saying`
- die `url` des gewaehlten `Image`
- die eigene `rating` des Focus

Dieselbe Kombination kann aus dem User-Pool auch wieder entfernt werden.

Der User-Pool referenziert damit nicht auf eine garantierte Konsistenz zum Factory-Bestand, sondern traegt seine fuer die Benutzung noetigen Daten eigenstaendig.

## Mindset-Pool

Der Mindset-Pool enthaelt die vom Benutzer zusammengestellten `Mindsets`.

Ein `Mindset` verbindet gespeicherte `Foci` zu einer hoeheren Orientierungseinheit.

## Entitaeten

### Saying

Aktuell traegt ein `Saying` mindestens:

- `id`
- `text`
- `fontSize`
- `categories`
- `rating`

`categories` ist eine Menge mehrerer Kategorien.

`rating` ist die sichtbare Bewertung des `Saying`.

### Image

Aktuell traegt ein `Image` mindestens:

- `id`
- `url`
- `color`
- `category`
- `rating`

`url` ist der Bildbezug innerhalb des Produktbestands.

`category` ist aktuell genau eine Kategorie.

`rating` ist die sichtbare Bewertung des `Image`.

### Focus

Aktuell traegt ein `Focus` mindestens:

- `saying`
- `imageUrl`
- `rating`

Dabei gilt:

- `saying` ist die in den User-Store uebernommene Saying-Datenform fuer diesen Focus
- `imageUrl` ist die in den User-Store uebernommene Bildreferenz fuer diesen Focus
- `rating` ist die eigene Bewertung des Focus

Ein `Focus` repraesentiert damit nicht bloss einen Verweis auf Factory-Daten.

Er traegt die fuer seine Benutzung noetige Datenform im User-Store selbst.

### Mindset

Aktuell traegt ein `Mindset` mindestens:

- `foci`
- `rating`

Dabei gilt:

- ein `Mindset` traegt mindestens einen `Focus`
- ein `Mindset` traegt hoechstens fuenf `Foci`

Weitere Felder wie Name oder Notizen koennen spaeter hinzukommen, wenn ihre fachliche Rolle erneut explizit festgelegt wird.

## Focus-Bildung als Datenvorgang

Die Bildung eines Focus verlaeuft fachlich in dieser Reihenfolge:

1. der Benutzer waehlt ein `Image`
2. der Benutzer waehlt ein `Saying`
3. die Kombination wird als Vorschau sichtbar
4. bestaetigt der Benutzer die Kombination, werden die benoetigten Daten in den User-Pool uebernommen und dort als `Focus` mit eigener Bewertung gespeichert
5. wird dieselbe gespeicherte Kombination wieder aufgehoben, wird dieser `Focus` aus dem User-Pool entfernt

In der Developer-Richtung darf diese Bestaetigung ueber die Sternbewertung erfolgen.

## Darstellung von Listen und Fokus

Wenn Einheiten in Listen erscheinen, gilt:

- Listen zeigen Daten an
- Listenelemente sind noch keine aktive Bearbeitung
- aktiv bearbeitbar wird erst das aktuell ausgewaehlte und dadurch fokussierte Element
- die UI liest also aus Daten plus aktuellem Fokuszustand, welche Bewertung manipulierbar ist

## Minimaler UI-Zustand

Damit die UI aus Daten lesbar werden kann, braucht das Produkt mindestens diese aktuelle Zustandswerte:

- aktuell ausgewaehltes `Saying`
- aktuell ausgewaehltes `Image`
- aktuelle Focus-Vorschau
- aktuell ausgewaehlter `Focus`
- aktuell ausgewaehltes `Mindset`

Diese Zustandswerte repraesentieren keinen neuen Fachbestand.

Sie machen nur sichtbar, welche vorhandene Einheit gerade im Vordergrund steht.

## Lokale Speicherung

Die lokale Speicherung traegt mindestens:

- die Benutzerauswahl
- den User-Pool der gespeicherten `Foci`
- die gespeicherten `Mindsets`
- das zuletzt als aktuell gesetzte `Mindset`

Dadurch kann die App beim erneuten Oeffnen in den zuletzt gespeicherten Orientierungskontext zurueckkehren.

## Offene Entscheidungen

Die folgenden Punkte bleiben auf dieser Schicht sichtbar:

- ob `Mindsets` zusaetzlich Namen oder Notizen als Kernbestandteile tragen sollen
- welche weiteren UI-Zustandswerte spaeter ausdruecklich als stabiler Teil des Store beschrieben werden sollen
