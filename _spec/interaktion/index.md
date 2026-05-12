# Interaktion

Diese Datei beschreibt die erste operative Interaktionsschicht von Digi Compass.

Sie klaert, in welchen Arbeitszusammenhaengen sich der Benutzer bewegt, welche Kernaufgaben dort moeglich sein muessen und wie zwischen diesen Zustaenden gewechselt wird.

## Leitfrage

Welche Interaktionsstruktur braucht Digi Compass, damit aus fachlicher Orientierung eine benutzbare UI-Ableitung werden kann?

## Kernsatz

Die Interaktion von Digi Compass fuehrt den Benutzer durch aufeinander bezogene Arbeitszustaende.

Diese Arbeitszustaende machen die fachlichen Operationen `Auswaehlen`, `Einordnen`, `Bewerten` und `Verbinden` konkret benutzbar.

## Interaktionsziel

Die Interaktion soll es dem Benutzer ermoeglichen:

- zwischen den drei Top-Level-Views `Mindset`, `Navigator` und `Collection` zu wechseln
- bedeutungstragende Einheiten wahrzunehmen
- eine aktuelle Einheit gezielt auszuwaehlen
- Saying- und Image-Auswahlen lokal zu erhalten
- ihre Relevanz sichtbar zu machen
- Elemente zu einem Focus zu verbinden
- Foci zu einem Mindset zu verbinden
- ein Mindset als aktuelle Hauptansicht zu betrachten
- zwischen diesen Ebenen orientiert zu wechseln

## Aktuelle Arbeitszustaende

Die erste Interaktionsschicht arbeitet mit mindestens diesen Arbeitszustaenden:

1. Elemente sichten
2. Focus bearbeiten
3. Mindset bearbeiten

Diese Arbeitszustaende muessen nicht als gleichnamige Screens umgesetzt werden.

Sie muessen aber als unterscheidbare Benutzungszustaende im Produkt lesbar sein.

Die Mindset-Ansicht ist dabei die primaere Hauptansicht des Produkts.

Sie ist zugleich eine von drei gleichberechtigten Top-Level-Views.

## Arbeitszustand Elemente sichten

In diesem Zustand arbeitet der Benutzer auf der Ebene einzelner Elemente.

Die Hauptaufgabe ist:

- ein Element wahrnehmen
- ein Element auswaehlen
- eine Saying- oder Image-Auswahl lokal erhalten
- ein Element bewerten
- ein Element als moeglichen Bestandteil eines Focus lesen

Mindestens sichtbar sein muss:

- die aktuell betrachtete Einheit
- ihre Darstellungsform
- ihre Kategorie oder Kategorien
- ob sie zur lokalen Benutzerauswahl gehoert
- ihre aktuelle oder moegliche Relevanz
- der naechste moegliche Schritt in Richtung Focus-Bildung

## Arbeitszustand Focus bearbeiten

In diesem Zustand arbeitet der Benutzer an einer ersten orientierenden Komposition.

Die Hauptaufgabe ist:

- genau ein ausgewaehltes Saying und genau ein ausgewaehltes Image zusammenzubringen
- ihre Verbindung als gemeinsame Richtung lesbar zu machen
- den Focus als eigene Einheit zu bewerten
- zu pruefen, ob der Focus tragfaehig genug fuer ein Mindset ist

Mindestens sichtbar sein muss:

- welches Saying und welches Image den aktuellen Focus bilden
- welche Kategorien diese beiden Bestandteile tragen
- welche Einheit aktuell innerhalb des Focus im Vordergrund steht
- welche Bewertung der Focus traegt oder tragen kann
- welche naechste Bearbeitung moeglich ist

## Arbeitszustand Mindset bearbeiten

In diesem Zustand arbeitet der Benutzer an einer hoeheren Orientierungseinheit aus mehreren Foci.

Die Hauptaufgabe ist:

- Foci zusammenzufuehren
- ihre gemeinsame Richtung lesbar zu machen
- das Mindset als eigene Einheit zu bewerten
- ein Mindset als aktuelle groessere Ansicht zu setzen
- die Orientierungskraft des Mindset im groesseren Zusammenhang wahrzunehmen

Mindestens sichtbar sein muss:

- welche Foci zum aktuellen Mindset gehoeren
- welcher Focus aktuell im Vordergrund steht
- welche Bewertung das Mindset traegt oder tragen kann
- ob dieses Mindset aktuell als Hauptansicht voreingestellt ist
- welche naechste Bearbeitung moeglich ist

In der aktuellen festen View-Grundform gilt zusaetzlich:

- ein `Mindset` zeigt hoechstens fuenf `Foci`
- die View zeigt dafuer genau fuenf Kartenplaetze
- mindestens ein `Focus` wird erwartet
- ein Mindset zeigt eine grosse aktive Focus-Karte
- daneben werden vier kleinere Focus-Karten gezeigt
- fehlende `Foci` bleiben als leere Plaetze sichtbar
- genau einer der vorhandenen `Foci` ist die grosse aktive Karte
- ein Klick auf eine kleine Karte macht diese zur grossen aktiven Karte
- nur auf der grossen aktiven Karte ist die Bewertung direkt einstellbar
- in dieser View schaltet dieselbe Bewertung den aktiven Wert nicht aus
- auf der grossen aktiven Karte ist eine Umschaltung in die Vollbildansicht moeglich

## Notwendige Benutzeroperationen

Die Interaktionsschicht muss mindestens diese Benutzeroperationen tragen:

- zwischen `Mindset`, `Navigator` und `Collection` wechseln
- eine Einheit auswaehlen
- eine Auswahl lokal speichern und wieder laden koennen
- eine Einheit bewerten
- Elemente in einen Focus uebernehmen
- Elemente aus einem Focus loesen koennen
- einen Focus auswaehlen
- einen Focus bewerten
- Foci in ein Mindset uebernehmen
- Foci aus einem Mindset loesen koennen
- ein Mindset als aktuelle Hauptansicht setzen koennen
- zwischen Elemente-, Focus- und Mindset-Arbeit wechseln

Diese Operationen beschreiben die fachlich notwendige Benutzbarkeit.

Sie legen noch nicht fest, ob dies ueber Buttons, Gesten, Listen, Karten oder andere UI-Muster erfolgt.

## Regel fuer Listen und Fokus

Wenn Einheiten in einer Liste erscheinen, gilt:

- Listenelemente zeigen Kategorien und Bewertung nur an
- Listenelemente sind nicht direkt manipulierbar
- erst die ausgewaehlte und dadurch fokussierte Einheit wird aktiv bearbeitbar
- insbesondere die Bewertung ist nur an der fokussierten Einheit manipulierbar

## Zustandswechsel

Die Interaktion von Digi Compass braucht klar lesbare Zustandswechsel zwischen ihren Arbeitszustaenden.

Mindestens diese Uebergaenge muessen moeglich sein:

1. von einem Element zur Focus-Bearbeitung
2. von einer Focus-Bearbeitung zurueck zur Element-Ebene
3. von einem Focus zur Mindset-Bearbeitung
4. von einer Mindset-Bearbeitung zurueck zur Focus-Ebene

## Regel fuer Uebergaenge

Ein Zustandswechsel ist fachlich gelungen, wenn:

- die neue Arbeitsebene klar erkennbar wird
- die aktuelle Einheit auf der neuen Ebene lesbar bleibt
- der Benutzer den Zusammenhang zur vorherigen Ebene nicht verliert

Ein Uebergang soll also nicht wie ein losgeloester Sprung wirken, sondern wie eine Fortsetzung derselben Orientierung.

## Sichtbarkeitsregel

In jedem Arbeitszustand soll der Benutzer mindestens drei Dinge erkennen koennen:

- was gerade die aktuelle Einheit ist
- auf welcher Ebene er gerade arbeitet
- welcher naechste sinnvolle Schritt moeglich ist

Diese Sichtbarkeit ist wichtiger als eine bestimmte Komponentenform.

## Startverhalten

Beim Oeffnen der App soll direkt das zuletzt als aktuell gesetzte Mindset erscheinen.

Dabei gilt:

- die App startet in der Mindset-Ansicht
- gezeigt wird das zuletzt voreingestellte Mindset in seiner groesseren Ansicht
- diese Ansicht soll unmittelbar lesbar machen, an welchen Spruch sich der Benutzer erinnern wollte
- der Zusammenhang zwischen aktuellem Mindset, enthaltenen Foci und dem erinnerten Spruch soll erkennbar bleiben

## Darstellungswirkung

Die UI soll die Interaktionszustande nicht durch viele gleichwertige Flaechen verwischen.

Sie soll bevorzugt:

- eine aktuelle Einheit klar hervorheben
- angrenzende moegliche Schritte mitfuehren
- den Wechsel zur naechsten Orientierungsebene lesbar machen

## Offene Entscheidungen

Die folgenden Punkte bleiben in dieser ersten Interaktionsschicht bewusst offen:

- ob die Arbeitszustaende als eigene Screens, umschaltbare Modi oder eingebettete Bereiche erscheinen
- welche konkrete Navigationsform den Ebenenwechsel am besten traegt
- wie stark Bearbeitung und Browsing in derselben Ansicht zusammengefuehrt werden sollen
