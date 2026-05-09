# Config Guide

Read the central `config.yaml` in `/_spec/` before the other spec files.

## Purpose

- `config.yaml` defines optional build scope flags
- the file lives centrally in `/_spec/config.yaml`
- disabled parts or features are not required for the current build

## Shape

```yaml
build:
  optional:
    navigator: false
    collection: false
    light_dark_mode: false
  switches:
    round_corners: false
```

## Keys

### `build.optional`

- `navigator`: boolean
- `collection`: boolean
- `light_dark_mode`: boolean

These flags control optional app parts and optional build areas.

### `build.switches`

- `round_corners`: boolean

These switches control app-wide behavior or presentation options.

