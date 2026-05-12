# Domain And Store

Diese Datei beschreibt die datengetragene Produktform von Digi Compass.

Sie klaert, welche fachlichen Entitaeten im Datenmodell getragen werden, welche Daten in den persoenlichen Store uebernommen werden und welcher UI-Zustand aus Daten sichtbar gemacht wird.

## Leitfrage

Welche fachlichen Daten repraesentieren das Produkt, und welcher minimale UI-Zustand wird aus diesen Daten heraus gelesen?

## Kernsatz

Die UI von Digi Compass wird durch fachliche Daten und einen kleinen aktuellen UI-Zustand repraesentiert.

Es wandern nur Daten.

Die UI fuehrt keine davon getrennten reichhaltigen Produktobjekte ein, sondern macht vorhandene Daten, Auswahlen, Vorschauen und gespeicherte Verbindungen sichtbar.

Zwischen Basisdaten und Store wird dabei keine garantierte Konsistenz vorausgesetzt.

## Grundunterscheidung

Digi Compass unterscheidet datenlogisch mindestens diese Bereiche:

1. Basisdaten
2. Store
4. aktueller UI-Zustand

## Basisdaten

Die Basisdaten sind der gewachsene Ausgangsbestand des Produkts:

- `Sayings`
- `Images`
- `Foci`

Diese Daten werden durch die Entitaeten `Saying`, `Image` und `Focus` repraesentiert.

Sie bilden den Factory-Bestand, aus dem der Benutzer fuer seine eigene Orientierung auswaehlt.

Dabei gilt zusaetzlich:

- bei Auslieferung der App ist dieser Factory-Bestand bereits vorhanden
- der Factory-Bestand listet alle mitgelieferten `Sayings` und `Images`
- der Factory-Bestand enthaelt zusaetzlich einige vom Developer vorgefertigte `Foci`
- diese vorgefertigten `Foci` dienen unter anderem einem schnelleren und einfacheren Start
- sie koennen spaeter auch vorbereitete Orientierung fuer den `Navigator` bereitstellen

## Store

Der Store enthaelt die vom Benutzer ausgewaehlten oder neu gebildeten und lokal gespeicherten `Sayings`, `Images`, `Foci` und `Mindsets`.

Dabei gilt:

- `Sayings` koennen aus dem Factory-Bestand in den Store aufgenommen und wieder entfernt werden
- `Images` koennen aus dem Factory-Bestand in den Store aufgenommen und wieder entfernt werden
- `Foci` koennen aus dem Factory-Bestand in den Store aufgenommen und wieder entfernt werden
- `Foci` koennen zusaetzlich im Produkt neu aus je einem Saying und einem Image des Store gebildet werden
- `Mindsets` koennen zusaetzlich im Produkt neu aus gespeicherten `Foci` des Store gebildet werden

Ein `Focus` entsteht nicht dadurch, dass ganze UI-Objekte verschoben werden.

Ein `Focus` entsteht datenlogisch entweder dadurch, dass ein vorkomponierter Factory-Focus in den Store uebernommen wird oder dadurch, dass die fuer einen neuen Focus benoetigten Daten aus dem Store zusammengefuehrt werden.

Ein neu gebildeter Focus traegt im Store mindestens:

- das gewaehlte `Saying`
- die `url` des gewaehlten `Image`
- die eigene `rating` des Focus

Dieselbe uebernommene oder neu gebildete Focus-Einheit kann aus dem Store auch wieder entfernt werden.

Der Store referenziert damit nicht auf eine garantierte Konsistenz zum Factory-Bestand, sondern traegt seine fuer die Benutzung noetigen Daten eigenstaendig.

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

- `id`
- `saying`
- `imageUrl`
- `rating`

Dabei gilt:

- `id` identifiziert den Focus als eigenstaendige Komposition
- `saying` ist die in den Store uebernommene Saying-Datenform fuer diesen Focus
- `imageUrl` ist die in den Store uebernommene Bildreferenz fuer diesen Focus
- `rating` ist die eigene Bewertung des Focus

Ein `Focus` repraesentiert damit nicht bloss einen Verweis auf Factory-Daten.

Er traegt die fuer seine Benutzung noetige Datenform im Store selbst.

### Mindset

Aktuell traegt ein `Mindset` mindestens:

- `foci`
- `rating`

Dabei gilt:

- ein `Mindset` traegt mindestens einen `Focus`
- ein `Mindset` traegt hoechstens fuenf `Foci`

Weitere Felder wie Name oder Notizen koennen spaeter hinzukommen, wenn ihre fachliche Rolle erneut explizit festgelegt wird.

## Focus-Bildung als Datenvorgang

Die Bildung eines neuen `Focus` verlaeuft aktuell im `Collection > Editor > Foci`-Tab in dieser Reihenfolge:

1. der Benutzer arbeitet mit `Images` und `Sayings`, die bereits im Store vorhanden sind
2. der Benutzer waehlt genau ein `Image` aus dem Store
3. der Benutzer waehlt genau ein `Saying` aus dem Store
4. die Kombination wird als aktuelle Focus-Vorschau sichtbar
5. bestaetigt der Benutzer die Kombination, wird daraus ein neuer `Focus` gebildet und in den Store uebernommen
6. wird derselbe gespeicherte Focus wieder aufgehoben, wird dieser `Focus` aus dem Store entfernt

## Mindset-Bildung als Datenvorgang

Die Bildung eines neuen `Mindset` verlaeuft aktuell im `Collection > Editor > Mindsets`-Tab in dieser Reihenfolge:

1. der Benutzer arbeitet mit `Foci`, die bereits im Store vorhanden sind
2. der Benutzer waehlt mehrere `Foci` aus dem Store
3. diese Zusammenstellung wird als aktuelle Mindset-Vorschau sichtbar
4. bestaetigt der Benutzer die Kombination, wird daraus ein neues `Mindset` gebildet und in den Store uebernommen
5. wird dasselbe gespeicherte `Mindset` wieder aufgehoben, wird dieses `Mindset` aus dem Store entfernt

In der Developer-Richtung darf diese Bestaetigung ueber die Sternbewertung erfolgen.

## Darstellung von Listen und Fokus

Wenn Einheiten in Listen erscheinen, gilt:

- Listen zeigen Daten an
- Listenelemente sind noch keine aktive Bearbeitung
- aktiv bearbeitbar wird erst das aktuell ausgewaehlte und dadurch fokussierte Element
- die UI liest also aus Daten plus aktuellem Fokuszustand, welche Bewertung manipulierbar ist

## Minimaler UI-Zustand

Damit die UI aus Daten lesbar werden kann, braucht das Produkt mindestens diese aktuelle Zustandswerte:

- aktueller `Collection`-Subview
- aktueller `Editor`-Tab
- aktuell ausgewaehltes `Saying`
- aktuell ausgewaehltes `Image`
- aktuelle Focus-Vorschau
- aktuell ausgewaehlter `Focus`
- aktuelle Mindset-Vorschau
- aktuell ausgewaehltes `Mindset`

Diese Zustandswerte repraesentieren keinen neuen Fachbestand.

Sie machen nur sichtbar, welche vorhandene Einheit gerade im Vordergrund steht.

## Lokale Speicherung

Die lokale Speicherung traegt mindestens:

- den Store mit den aufgenommenen `Sayings`
- den Store mit den aufgenommenen `Images`
- den Store mit den gespeicherten `Foci`
- den Store mit den gespeicherten `Mindsets`
- das zuletzt als aktuell gesetzte `Mindset`

Dadurch kann die App beim erneuten Oeffnen in den zuletzt gespeicherten Orientierungskontext zurueckkehren.

## Offene Entscheidungen

Die folgenden Punkte bleiben auf dieser Schicht sichtbar:

- ob `Mindsets` zusaetzlich Namen oder Notizen als Kernbestandteile tragen sollen
- welche weiteren UI-Zustandswerte spaeter ausdruecklich als stabiler Teil des Store beschrieben werden sollen
