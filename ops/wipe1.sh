#!/usr/bin/env bash
# Stage wipe 1

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "Running wipe1 in $ROOT_DIR"

# Keep:
# - AGENTS.md
# - _spec/index.md
# - frontend/src/data/*.json
# - frontend/public/images/**

rm -rf frontend/dist
rm -rf frontend/node_modules
rm -rf frontend/.vite

rm -f frontend/src/app/App.tsx
rm -f frontend/src/app/views/collection/CollectionImagePanel.tsx
rm -f frontend/src/app/views/collection/CollectionSayingList.tsx
rm -f frontend/src/app/views/collection/CollectionSayingPanel.tsx
rm -f frontend/src/app/views/collection/CollectionView.tsx
rm -f frontend/src/app/views/collection/imageOverlayTone.ts
rm -f frontend/src/app/views/focusEditor/FocusEditorView.tsx
rm -f frontend/src/app/views/primary/PrimaryView.tsx
rm -f frontend/src/app/views/shared/CompassCard.tsx
rm -f frontend/src/app/views/shared/FocusTile.tsx
rm -f frontend/src/app/views/shared/ImageTile.tsx
rm -f frontend/src/app/views/shared/MindsetTile.tsx
rm -f frontend/src/app/views/shared/SelectableTileGrid.tsx
rm -f frontend/src/app/views/shared/StarRating.tsx
rm -f frontend/src/components/Button.tsx
rm -f frontend/src/components/Tabs.tsx
rm -f frontend/src/lib/imageCache.ts
rm -f frontend/src/store/compassStore.ts
rm -f frontend/src/store/factoryState.ts
rm -f frontend/src/styles/index.css
rm -f frontend/src/types/domain.ts
rm -f frontend/src/main.tsx
rm -f frontend/src/vite-env.d.ts

rm -f frontend/README.md
rm -f frontend/eslint.config.js
rm -f frontend/index.html
rm -f frontend/package-lock.json
rm -f frontend/package.json
rm -f frontend/postcss.config.cjs
rm -f frontend/scripts/sync-images.mjs
rm -f frontend/tailwind.config.ts
rm -f frontend/tsconfig.app.json
rm -f frontend/tsconfig.app.tsbuildinfo
rm -f frontend/tsconfig.json
rm -f frontend/tsconfig.node.json
rm -f frontend/tsconfig.node.tsbuildinfo
rm -f frontend/vite.config.ts

find frontend/src/app -type d -empty -delete 2>/dev/null || true
find frontend/src/components -type d -empty -delete 2>/dev/null || true
find frontend/src/lib -type d -empty -delete 2>/dev/null || true
find frontend/scripts -type d -empty -delete 2>/dev/null || true
find frontend/src/store -type d -empty -delete 2>/dev/null || true
find frontend/src/styles -type d -empty -delete 2>/dev/null || true
find frontend/src/types -type d -empty -delete 2>/dev/null || true

echo "wipe1 complete"
