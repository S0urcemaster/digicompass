# Developer Notes

Diese Datei ist fuer spaetere Darstellungs-Schaerfungen vorgesehen.

Sie ist nicht Teil der aktiven Produkt-Default-Richtung.

## Leitfrage

Wo koennen spaetere gezielte UI-Schaerfungen gesammelt werden, ohne die Haupt-Spezifikation vorschnell zu verengen?

## Rolle

Diese Datei sammelt spaetere Hinweise, wenn die Default-Empfehlungen fuer eine belastbare UI-Ableitung nicht ausreichen.

Sie kann gezielt als Arbeitsgrundlage verwendet werden, wenn eine staerkere Darstellungs-Schaerfung gewuenscht ist.

Eintraege in dieser Datei gelten erst dann als bevorzugte Ableitungsgrundlage, wenn explizit festgelegt wird, dass sie fuer die laufende Arbeit oder spaeter dauerhaft herangezogen werden sollen.

## Aktuelle Developer-Richtung

Die aktuelle Developer-Richtung bevorzugt:

- moeglichst grosse Schaltflaechen
- moeglichst wenig Rand
- moeglichst wenig Abstand

Diese Richtung gilt fuer das App-Gehaeuse als bevorzugte Default-Schaerfung.

## Button-Arten

Digi Compass kennt in der Darstellung mindestens zwei Button-Arten:

1. Gehaeuse-Buttons
2. Image-Buttons

### Gehaeuse-Buttons

Gehaeuse-Buttons sind Schaltflaechen auf dem App-Gehaeuse und ausserhalb des Bildinhalts.

Fuer sie gilt in der aktuellen Developer-Richtung:

- sie sollen moeglichst gross benutzbar sein
- sie sollen wenig Randflaeche um sich herum haben
- sie sollen mit moeglichst wenig Abstand zueinander oder zu angrenzenden Bereichen auskommen
- sie duerfen den Eindruck einer dicht genutzten, direkt bearbeitbaren Oberflaeche verstaerken

### Image-Buttons

Image-Buttons sind benutzbare Elemente auf Images oder direkt ueber Bildinhalten.

Fuer sie gilt:

- sie sollen das Bild moeglichst wenig verdecken
- sie sollen dabei so gross wie moeglich benutzbar und lesbar bleiben
- ihre Platzierung soll die Bildwirkung moeglichst wenig stoeren
- ihre Flaeche soll nur so weit in den Bildraum eingreifen, wie die Benutzbarkeit es wirklich braucht

## Leseregel fuer Agenten

Wenn mit `developer` gearbeitet wird, sollen Agenten:

- grosse Gehaeuse-Buttons bevorzugen
- Rand und Abstand knapp halten
- Image-Buttons so platzieren, dass Bildflaeche maximal erhalten bleibt
- keine luftige oder grosszuegig verstreute UI als Default annehmen
