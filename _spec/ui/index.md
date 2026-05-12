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
- die UI-Varianten zunaechst als Empfehlungsschicht
- spaetere Developer-Schaerfungen nur dann als bindende Richtung, wenn sie ausdruecklich aktiviert oder in die Haupt-Spezifikation uebernommen wurden

## Offene Entscheidungen

Die folgenden Punkte bleiben in dieser Schicht bewusst offen:

- welche konkrete UI-Variante zunaechst bevorzugt werden soll
- welche visuellen Muster fuer Navigation, Browser oder Editor langfristig am tragfaehigsten sind
- welche spaeteren Developer-Schaerfungen dauerhaft in die Haupt-Spezifikation uebergehen
