#!/usr/bin/env bash
# Stage wipe 1

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "Running wipe1 in $ROOT_DIR"

# Keep:
# - AGENTS.md
# - _spec/index.md
# - frontend/src/data/**
# - frontend/public/images/**

rm -rf frontend/dist
rm -rf frontend/node_modules
rm -rf frontend/.vite

find frontend/src -mindepth 1 -depth \
  ! -path 'frontend/src/data' \
  ! -path 'frontend/src/data/*' \
  -exec rm -rf {} +

find frontend -maxdepth 1 -type f -delete
rm -rf .codex
rm -f .nvmrc

find frontend/scripts -type d -empty -delete 2>/dev/null || true
find frontend/src -type d -empty -delete 2>/dev/null || true

echo "wipe1 complete"
