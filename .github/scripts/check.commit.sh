#!/bin/bash

log() {
  echo "[CHECK][COMMIT] $1"
}

log "Checking today's commit..."

TODAY=$(date -u +"%Y-%m-%d")

COMMITS=$(git log --since="$TODAY 00:00" --until="$TODAY 23:59" --oneline | wc -l)

log "Total commits today: $COMMITS"

if [ "$COMMITS" -gt 0 ]; then
  echo "has_commit=true" >> $GITHUB_ENV
  log "Status: HAS COMMIT"
else
  echo "has_commit=false" >> $GITHUB_ENV
  log "Status: NO COMMIT"
fi