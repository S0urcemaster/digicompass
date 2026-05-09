# Config Guide

Die zentrale `config.yaml` in `/_spec/` vor den anderen Spec-Dateien lesen.

## Zweck

- `config.yaml` definiert optionale Build-Scope-Flags
- die Datei liegt zentral in `/_spec/config.yaml`
- deaktivierte Teile oder Features sind im aktuellen Build nicht erforderlich

## Struktur

```yaml
build:
  optional:
    navigator: false
    collection: false
    light_dark_mode: false
  switches:
    round_corners: false
```

## Schlüssel

### `build.optional`

- `navigator`: boolean
- `collection`: boolean
- `light_dark_mode`: boolean

Diese Flags steuern optionale App-Teile und optionale Build-Bereiche.

### `build.switches`

- `round_corners`: boolean

Diese Schalter steuern app-weite Verhaltens- oder Darstellungsoptionen.

## Regel

- `Compass` gehört zum Kernbereich und wird hier nicht konfiguriert
- neue Flags hier nur ergänzen, wenn sie den Build-Scope oder ein app-weites Verhalten ändern
