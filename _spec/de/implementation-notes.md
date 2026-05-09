# Implementierungshinweise

## Funktionsüberblick

### Implementiert

#### App Shell

- Username anzeigen
- Username ändern
- zwischen Top-Level-Views umschalten

#### Compass View

- das aktuelle Mindset anzeigen
- den aktuellen Fokus des aktuellen Mindsets anzeigen
- das aktive Mindset auswählen
- den aktiven Fokus innerhalb des aktuellen Mindsets auswählen
- Mindset-Notizen über das `textarea` bearbeiten
- den aktuell ausgewählten Fokus bewerten

#### Collection: Images

- alle Basisbilder durchsuchen
- Bilder nach Kategorie filtern
- durch Bild-Previews blättern
- ein Bild auswählen
- das ausgewählte Bild in einer größeren Modalansicht öffnen
- ein Bild durch Bewertung zur Sammlung hinzufügen
- die Bewertung eines gesammelten Bildes ändern

#### Collection: Sayings

- alle Basis-Sprüche durchsuchen
- Sprüche nach Kategorie filtern
- durch Spruchergebnisse blättern
- einen Spruch auswählen
- einen Spruch durch Bewertung zur Sammlung hinzufügen
- die Bewertung eines gesammelten Spruchs ändern

#### Collection: Foci

- gesammelte Foki durchsuchen
- Foki nach Kategorie filtern
- durch Fokus-Ergebnisse blättern
- einen bestehenden Fokus auswählen
- zwischen Fokuslisten-Modus, Bild-Modus und Spruch-Modus umschalten
- gesammelte Bilder für die Fokus-Zusammenstellung auswählen
- gesammelte Sprüche für die Fokus-Zusammenstellung auswählen
- den zusammengesetzten Fokus vorab anzeigen
- einen neuen Fokus durch Bewertung zur Sammlung hinzufügen
- die Bewertung eines bestehenden gesammelten Fokus ändern
- einen gesammelten Fokus entfernen, indem seine Bewertung auf `0` gesetzt wird

#### Collection: Mindsets

- Sammlung-Mindsets durchsuchen
- gesammelte Foki für die Mindset-Zuweisung durchsuchen
- durch Mindset- und Fokuslisten blättern
- einen neuen Mindset-Entwurf erstellen
- ein bestehendes Mindset in den Editor laden
- den Mindset-Namen ändern
- gesammelte Foki auf bis zu 5 Mindset-Slots zuweisen
- ein Mindset aus dem aktuellen Entwurf durch Bewertung erstellen
- die Bewertung eines bestehenden Mindsets ändern
- ein Mindset entfernen, indem seine Bewertung auf `0` gesetzt wird

### Teilweise implementiert

#### Focus Editing

- Fokus-Erstellung funktioniert bereits innerhalb von `Collection > Foci`
- Fokus-Bearbeitung ist aktuell auf Listenauswahl, Preview und Bewertungsinteraktionen verteilt
- Es gibt noch keine separate finalisierte `Focus Editor View`

#### Mindset Editing

- Mindset-Erstellung und -Bearbeitung funktionieren bereits innerhalb von `Collection > Mindsets`
- Der aktuelle Ablauf ist editor-ähnlich, aber noch nicht als eigene dedizierte Komponentenarchitektur formalisiert

### Noch nicht definiert

- Verhalten der `Navigator`-View
- finaler Save-Flow und endgültige UX-Regeln für Fokus-Erstellung
- finalisierte eigenständige `Focus Editor View`

## Reihenfolge für den Neuaufbau

Diese Reihenfolge beim Neuaufbau oder bei Erweiterungen des Projekts verwenden:

1. Diese Spec als primäre Quelle für Struktur, Verhalten und Komposition behandeln.
2. `frontend/src/data/*.json` und `frontend/public/images/**` als Quelldaten behandeln, nicht als UI-Implementierung.
3. Dünne, explizite Komponenten aus der Spec bevorzugt neu aufbauen, statt inkonsistenten Legacy-Code zu konservieren.
4. Die Komponentenregel strikt einhalten: keine lokalen Einweg-Komponenten innerhalb anderer Dateien.
5. Zuerst Shared Components bauen, danach Views aus diesen Komponenten zusammensetzen.
6. Datenladen, Zustandsübergänge und Darstellung getrennt halten.
7. Wenn die aktuelle Implementierung von der Spec abweicht, zuerst die Spec aktualisieren, falls das neue Verhalten beabsichtigt ist.
8. Die aktuelle Implementierung nur als Extraktionsmaterial verwenden, nicht als harte Einschränkung.
9. Veraltete Planungshinweise nach unten verschieben, statt sie sofort zu löschen, wenn sie für spätere Revisionen noch nützlich sein können.

## Aktuelle Build-Prioritäten

- das JSON-Datenmodell und die Bild-Assets stabil halten
- `compassStore` und Domänentypen an die aktuelle Spec angleichen
- collection-bezogene Browser aus wiederverwendbaren Shared Components neu aufbauen
- die aktuelle visuelle Struktur erhalten, wo die Spec sie bereits definiert
- `Navigator` zurückstellen, bis die bestehenden Collection- und Compass-Workflows wieder sauber sind

## Arbeitsregel für offene Aufgaben

- nur die wirklich nächsten umsetzbaren Punkte in der aktiven Aufgabenliste halten
- erledigte Punkte nach `Finished Tasks` verschieben
- obsolete oder bereits abgedeckte Punkte in einen Legacy-Unterbereich verschieben, statt sie mit aktiven Tasks zu mischen

## Geplante Aufgaben

- die ersten wiederverwendbaren Komponentenentwürfe aus der aktuellen Spec fertigstellen
- die verbleibende Implementierung an das JSON-basierte Datenmodell angleichen

## Offene Aufgaben

- die verbleibende Implementierung von Kategorie-Objekten auf String-Kategorien umstellen
- die verbleibende Implementierung von Bild-Kategorielisten auf ein einzelnes Bild-Kategoriefeld umstellen
- verbleibende TypeScript-Datenimporte durch JSON-basiertes Laden oder Adapter ersetzen
- das erste wiederverwendbare Komponentenset aus den bestehenden Views extrahieren
- die `Compass View` aus `MindsetPaginator`, `CardBrowser` und `textarea` neu aufbauen
- die Bereiche der `Collection View` aus den aktuell spezifizierten Browser-Komponenten neu aufbauen

## Erledigte Aufgaben

- `_spec/index.md` so umstrukturiert, dass die aktive Spezifikation oben steht und Legacy-Material nach unten getrennt ist
- Datenfiles von TypeScript-Datenmodulen auf JSON umgestellt
- Kategorien auf einfache Strings reduziert
- Bild-Kategoriedaten auf ein einzelnes Kategorienfeld reduziert
- große Teile der Spec an das aktuelle Implementierungsverhalten angepasst
