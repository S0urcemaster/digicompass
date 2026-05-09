# Digi Compass Specification

Start here. This file is the entry point for the specification and points to the current source files.

Ignore translated specification in _spec/de except when explicitly working on it

## Reading Order

1. [Config](./config.yaml)
2. [Config Guide](./config-guide.md)
3. [Overview](./overview.md)
4. [Architecture](./architecture.md)
5. [Components](./components.md)
6. [Domain And Store](./domain-store.md)
7. [Views](./views.md)
8. [Implementation Notes](./implementation-notes.md)
9. [AI Worksheet](./ai-worksheet.md)

## Intent

- Keep this file short so `AGENTS.md` can continue to reference a stable starting point
- Keep detailed rules in topic-specific files
- Extend the relevant topic file first when behavior changes intentionally
- Read configuration switches first, before interpreting product scope or UI composition

## Scope Map

- Build-time scope switches and optional features: [config.yaml](./config.yaml)
- Config format, reading rules, and allowed options: [config-guide.md](./config-guide.md)
- Product purpose and current core rules: [overview.md](./overview.md)
- UI composition rules and reusable component definitions: [architecture.md](./architecture.md), [components.md](./components.md)
- Types, persisted state, and data boundaries: [domain-store.md](./domain-store.md)
- Screen behavior and workflows: [views.md](./views.md)
- Build guidance and execution rules: [implementation-notes.md](./implementation-notes.md)
- Current implementation status and active work packet: [ai-worksheet.md](./ai-worksheet.md)
