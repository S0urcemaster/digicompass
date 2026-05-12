# UI Specification

Diese Datei beschreibt die Darstellungs-Schicht von Digi Compass.

Sie legt die feste Layout-Richtung fest und beschreibt, wie UI-Varianten in der Spezifikation gefuehrt werden.

## Leitfrage

Welche UI-Richtung bleibt verbindlich, und welche Teile der Darstellung duerfen bewusst offen und variantenfaehig bleiben?

## Feste Darstellungsregel

Digi Compass wird auf Smartphones optimiert.

Die primaere Produktform ist ein schmales Hochformat.

Auf dem Desktop bleibt dieselbe Hochformat-Logik erhalten.

Desktop vergroessert das Produkt also nicht zu einer grundsaetzlich anderen Flaechenlogik, sondern zeigt dieselbe Hochformat-App in einem groesseren umgebenden Raum.

## Minimale verbindliche UI-Definitionen

Die folgenden UI-Aussagen sind nicht optional, sondern Teil der verbindlichen Darstellungsgrundlage:

- Digi Compass kennt zwei funktional unterschiedliche Button-Arten.
- Digi Compass kennt fuer `Focus` zwei Darstellungsarten: `selected` und `preview`.
- Es gibt Schaltflaechen auf dem App-Gehaeuse.
- Es gibt benutzbare Elemente auf Images.
- Benutzbare Elemente auf Images sollen das Bild moeglichst wenig verdecken.
- Gleichzeitig sollen diese benutzbaren Elemente so gross wie moeglich lesbar und benutzbar bleiben.
- `Image`- und `Focus`-Karten folgen einer festen Fuenf-Reihen-Gliederung aus `header`, `content`, `content`, `content`, `footer`.
- Kategorien, Text und Bewertung auf Karten sollen den verfuegbaren Raum moeglichst weitgehend nutzen.
- Komponenten auf Bildflaechen sollen im Kontrast zum Bildtyp `hell`, `dunkel` oder `mix` stehen.

Diese Regeln gelten unabhaengig davon, welche UI-Variante spaeter konkret ausgearbeitet wird.

## Rolle der UI-Spezifikation

Die UI-Spezifikation beschreibt nicht zuerst exakte Pixel-Loesungen.

Sie beschreibt zuerst:

- welche Wirkung die Darstellung tragen soll
- welche Layout-Richtung verbindlich ist
- welche UI-Varianten als Empfehlungen verfuegbar sind
- welche Schaerfungen bei Bedarf spaeter gezielt hinzukommen

## Variantenprinzip

Die UI von Digi Compass darf in ihrer konkreten Ausformung variieren, solange die fachliche Richtung, die Kernoperationen und die feste Layout-Regel erhalten bleiben.

UI-Varianten werden deshalb als Varianten im Verzeichnis `/_spec/ui/` gefuehrt.

Diese Varianten sind zunaechst Empfehlungen.

Sie werden erst dann zu engeren Vorgaben, wenn eine spaetere Schaerfung dies ausdruecklich festlegt.

## Aktuelle Dateien in dieser Schicht

1. [Default Theme](./default-theme.md)
2. [Developer Notes](./developer.md)

## Leseregel fuer Agenten

Ein Agent liest in dieser Schicht:

- die feste Smartphone- und Hochformat-Regel als verbindlich
- die minimalen UI-Definitionen als verbindlich
- die UI-Varianten zunaechst als Empfehlungsschicht
- die in `/_spec/index.md` benannte aktive UI-Richtung als bevorzugte UI-Ableitung
- Developer-Schaerfungen nur dann als bevorzugte Richtung, wenn sie ausdruecklich fuer die laufende Arbeit herangezogen oder spaeter in die Haupt-Spezifikation uebernommen werden

## Theme-Wahl fuer Runs

Vor einer konkreten UI-Ableitung, einem Build oder einer Umsetzung mit Darstellungsschwerpunkt soll die UI-Richtung fuer den aktuellen Run geklaert werden.

Dabei gilt:

- ohne Auswahl gilt die aktive Produkt-Default-Richtung aus `/_spec/index.md`
- eine abweichende Wahl wie `developer` gilt zunaechst nur fuer den aktuellen Run
- die run-spezifische Wahl veraendert nicht automatisch die dauerhafte Produkt-Default-Richtung

## Offene Entscheidungen

Die folgenden Punkte bleiben in dieser Schicht bewusst offen:

- welche konkrete UI-Variante zunaechst bevorzugt werden soll
- welche visuellen Muster fuer Navigation, Browser oder Editor langfristig am tragfaehigsten sind
- welche spaeteren Developer-Schaerfungen dauerhaft in die Haupt-Spezifikation uebergehen
