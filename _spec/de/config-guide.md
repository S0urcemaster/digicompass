# Config Guide

`config.yaml` vor den anderen Spec-Dateien lesen.

## Zweck

- `config.yaml` definiert optionale Build-Scope-Flags
- deaktivierte Teile oder Features sind im aktuellen Build nicht erforderlich

## Struktur

```yaml
build:
  optional:
    navigator: false
    collection: false
    light_dark_mode: false
    round_corners: false
```

## Schlüssel

### `build.optional`

- `navigator`: boolean
- `collection`: boolean
- `light_dark_mode`: boolean
- `round_corners`: boolean

Diese Flags steuern optionale App-Teile und optionale Build-Features.

## Regel

- `Compass` gehört zum Kernbereich und wird hier nicht konfiguriert
- neue Flags hier nur ergänzen, wenn sie den Build-Scope oder ein app-weites Verhalten ändern
