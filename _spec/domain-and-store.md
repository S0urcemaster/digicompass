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
- `Foci`

Diese Daten werden durch die Entitaeten `Saying`, `Image` und `Focus` repraesentiert.

Sie bilden den Factory-Bestand, aus dem der Benutzer fuer seine eigene Orientierung auswaehlt.

Dabei gilt zusaetzlich:

- bei Auslieferung der App ist dieser Factory-Bestand bereits vorhanden
- der Factory-Bestand listet alle mitgelieferten `Sayings` und `Images`
- der Factory-Bestand enthaelt zusaetzlich einige vom Developer vorgefertigte `Foci`
- diese vorgefertigten `Foci` dienen unter anderem einem schnelleren und einfacheren Start
- sie koennen spaeter auch vorbereitete Orientierung fuer den `Navigator` bereitstellen

## User-Pool

Der User-Pool enthaelt die vom Benutzer ausgewaehlten oder neu gebildeten und lokal gespeicherten `Sayings`, `Images` und `Foci`.

Dabei gilt:

- `Sayings` koennen aus dem Factory-Bestand in den User-Store aufgenommen und wieder entfernt werden
- `Images` koennen aus dem Factory-Bestand in den User-Store aufgenommen und wieder entfernt werden
- `Foci` koennen aus dem Factory-Bestand in den User-Store aufgenommen und wieder entfernt werden
- `Foci` koennen zusaetzlich im Produkt neu aus je einem Saying und einem Image des User-Store gebildet werden

Ein `Focus` entsteht nicht dadurch, dass ganze UI-Objekte verschoben werden.

Ein `Focus` entsteht datenlogisch entweder dadurch, dass ein vorkomponierter Factory-Focus in den User-Store uebernommen wird oder dadurch, dass die fuer einen neuen Focus benoetigten Daten aus dem User-Store zusammengefuehrt werden.

Ein neu gebildeter Focus traegt im User-Store mindestens:

- das gewaehlte `Saying`
- die `url` des gewaehlten `Image`
- die eigene `rating` des Focus

Dieselbe uebernommene oder neu gebildete Focus-Einheit kann aus dem User-Pool auch wieder entfernt werden.

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

- `id`
- `saying`
- `imageUrl`
- `rating`

Dabei gilt:

- `id` identifiziert den Focus als eigenstaendige Komposition
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

Die Arbeit mit Foci verlaeuft in `Collection > Foci` aktuell in zwei Modi:

1. Focus-Browser-Modus
2. Focus-Editor-Modus

Im Focus-Browser-Modus gilt:

1. die Focus-Liste zeigt `Foci` aus dem Factory-Bestand
2. der Benutzer kann einen angezeigten Factory-Focus in den User-Store aufnehmen
3. der Benutzer kann einen bereits aufgenommenen Focus wieder aus dem User-Store entfernen
4. der Toggle zeigt in diesem Zustand den Text `Edit -&gt;`

Im Focus-Editor-Modus gilt:

1. aktiviert der Benutzer den Toggle, wechselt `Collection > Foci` vom Focus-Browser-Modus in den Focus-Editor-Modus
2. der Toggle zeigt in diesem Zustand den Text `&lt;- Foci`
3. nur im aktiven Editor-Modus werden die beiden anderen Tabs `Images` und `Sayings` benutzbar
4. diese beiden Tabs zeigen `Images` und `Sayings` aus dem User-Store
5. der Benutzer waehlt dort genau ein `Image` und genau ein `Saying` aus seinem User-Store
6. diese Auswahl wird als aktuelle Focus-Vorschau sichtbar
7. bestaetigt der Benutzer die Kombination, wird daraus ein neuer `Focus` gebildet und in den User-Store uebernommen
8. wird derselbe gespeicherte Focus wieder aufgehoben, wird dieser `Focus` aus dem User-Pool entfernt
9. aktiviert der Benutzer den Toggle erneut, verlaesst `Collection > Foci` den Editor-Modus und zeigt wieder die Focus-Liste

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
- aktiver Modus in `Collection > Foci`
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
- die in den User-Store aufgenommenen `Sayings`
- die in den User-Store aufgenommenen `Images`
- den User-Pool der gespeicherten `Foci`
- die gespeicherten `Mindsets`
- das zuletzt als aktuell gesetzte `Mindset`

Dadurch kann die App beim erneuten Oeffnen in den zuletzt gespeicherten Orientierungskontext zurueckkehren.

## Offene Entscheidungen

Die folgenden Punkte bleiben auf dieser Schicht sichtbar:

- ob `Mindsets` zusaetzlich Namen oder Notizen als Kernbestandteile tragen sollen
- welche weiteren UI-Zustandswerte spaeter ausdruecklich als stabiler Teil des Store beschrieben werden sollen
