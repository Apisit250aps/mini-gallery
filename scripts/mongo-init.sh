#!/bin/bash
set -euo pipefail

ARCHIVE_PATH="${MONGO_INIT_ARCHIVE_PATH:-/backup/init.gz}"

if [ ! -f "$ARCHIVE_PATH" ]; then
  echo "[mongo-init] Archive not found at $ARCHIVE_PATH, skipping restore."
  exit 0
fi

if ! command -v mongorestore >/dev/null 2>&1; then
  echo "[mongo-init] mongorestore not found in container image."
  exit 1
fi

echo "[mongo-init] Restoring MongoDB data from $ARCHIVE_PATH"

RESTORE_ARGS=(--gzip --archive="$ARCHIVE_PATH" --drop)

if [ -n "${MONGO_INITDB_ROOT_USERNAME:-}" ] && [ -n "${MONGO_INITDB_ROOT_PASSWORD:-}" ]; then
  RESTORE_ARGS+=(
    --username="$MONGO_INITDB_ROOT_USERNAME"
    --password="$MONGO_INITDB_ROOT_PASSWORD"
    --authenticationDatabase=admin
  )
fi

mongorestore "${RESTORE_ARGS[@]}"

echo "[mongo-init] Restore completed successfully."
