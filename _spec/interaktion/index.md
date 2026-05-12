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

- bedeutungstragende Einheiten wahrzunehmen
- eine aktuelle Einheit gezielt auszuwaehlen
- ihre Relevanz sichtbar zu machen
- Elemente zu einem Focus zu verbinden
- Foci zu einem Mindset zu verbinden
- zwischen diesen Ebenen orientiert zu wechseln

## Aktuelle Arbeitszustaende

Die erste Interaktionsschicht arbeitet mit mindestens diesen Arbeitszustaenden:

1. Elemente sichten
2. Focus bearbeiten
3. Mindset bearbeiten

Diese Arbeitszustaende muessen nicht als gleichnamige Screens umgesetzt werden.

Sie muessen aber als unterscheidbare Benutzungszustaende im Produkt lesbar sein.

## Arbeitszustand Elemente sichten

In diesem Zustand arbeitet der Benutzer auf der Ebene einzelner Elemente.

Die Hauptaufgabe ist:

- ein Element wahrnehmen
- ein Element auswaehlen
- ein Element bewerten
- ein Element als moeglichen Bestandteil eines Focus lesen

Mindestens sichtbar sein muss:

- die aktuell betrachtete Einheit
- ihre Darstellungsform
- ihre aktuelle oder moegliche Relevanz
- der naechste moegliche Schritt in Richtung Focus-Bildung

## Arbeitszustand Focus bearbeiten

In diesem Zustand arbeitet der Benutzer an einer ersten orientierenden Komposition.

Die Hauptaufgabe ist:

- ausgewaehlte Elemente zusammenzubringen
- ihre Verbindung als gemeinsame Richtung lesbar zu machen
- den Focus als eigene Einheit zu bewerten
- zu pruefen, ob der Focus tragfaehig genug fuer ein Mindset ist

Mindestens sichtbar sein muss:

- welche Elemente den aktuellen Focus bilden
- welche Einheit aktuell innerhalb des Focus im Vordergrund steht
- welche Bewertung der Focus traegt oder tragen kann
- welche naechste Bearbeitung moeglich ist

## Arbeitszustand Mindset bearbeiten

In diesem Zustand arbeitet der Benutzer an einer hoeheren Orientierungseinheit aus mehreren Foci.

Die Hauptaufgabe ist:

- Foci zusammenzufuehren
- ihre gemeinsame Richtung lesbar zu machen
- das Mindset als eigene Einheit zu bewerten
- die Orientierungskraft des Mindset im groesseren Zusammenhang wahrzunehmen

Mindestens sichtbar sein muss:

- welche Foci zum aktuellen Mindset gehoeren
- welcher Focus aktuell im Vordergrund steht
- welche Bewertung das Mindset traegt oder tragen kann
- welche naechste Bearbeitung moeglich ist

## Notwendige Benutzeroperationen

Die Interaktionsschicht muss mindestens diese Benutzeroperationen tragen:

- eine Einheit auswaehlen
- eine Einheit bewerten
- Elemente in einen Focus uebernehmen
- Elemente aus einem Focus loesen koennen
- einen Focus auswaehlen
- einen Focus bewerten
- Foci in ein Mindset uebernehmen
- Foci aus einem Mindset loesen koennen
- zwischen Elemente-, Focus- und Mindset-Arbeit wechseln

Diese Operationen beschreiben die fachlich notwendige Benutzbarkeit.

Sie legen noch nicht fest, ob dies ueber Buttons, Gesten, Listen, Karten oder andere UI-Muster erfolgt.

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
