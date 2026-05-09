# Digi Compass Spezifikation

Hier beginnen. Diese Datei ist der Einstiegspunkt in die Spezifikation und verweist auf die aktuellen Quelldateien.

## Lesereihenfolge

1. [Config](./config.yaml)
2. [Config Guide](./config-guide.md)
3. [Überblick](./overview.md)
4. [Architektur](./architecture.md)
5. [Komponenten](./components.md)
6. [Domäne und Store](./domain-store.md)
7. [Views](./views.md)
8. [Implementierungshinweise](./implementation-notes.md)

## Zweck

- Diese Datei kurz halten, damit `AGENTS.md` weiter auf einen stabilen Einstiegspunkt verweisen kann
- Detaillierte Regeln in thematischen Dateien halten
- Bei absichtlichen Verhaltensänderungen zuerst die passende Themen-Datei erweitern
- Konfigurationsschalter zuerst lesen, bevor Produktscope oder UI-Komposition interpretiert werden

## Bereichsübersicht

- Build-Scope-Schalter und optionale Features: [config.yaml](./config.yaml)
- Konfigurationsformat, Leseregeln und erlaubte Optionen: [config-guide.md](./config-guide.md)
- Produktzweck und aktuelle Kernregeln: [overview.md](./overview.md)
- Regeln zur UI-Komposition und wiederverwendbare Komponentendefinitionen: [architecture.md](./architecture.md), [components.md](./components.md)
- Typen, persistierter State und Datengrenzen: [domain-store.md](./domain-store.md)
- Screen-Verhalten und Workflows: [views.md](./views.md)
- Build-Hinweise, Prioritäten und Aufgabenlisten: [implementation-notes.md](./implementation-notes.md)
