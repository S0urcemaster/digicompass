# Config Guide

Read `config.yaml` before the other spec files.

## Purpose

- `config.yaml` defines optional build scope flags
- disabled parts or features are not required for the current build

## Shape

```yaml
build:
  optional:
    navigator: false
    collection: false
    light_dark_mode: false
    round_corners: false
```

## Keys

### `build.optional`

- `navigator`: boolean
- `collection`: boolean
- `light_dark_mode`: boolean
- `round_corners`: boolean

These flags control optional app parts and optional build features.

## Rule

- `Compass` is core scope and is not configured here
- add new flags here only if they change build scope or cross-cutting app behavior
