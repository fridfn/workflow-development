#!/bin/bash

# ==========================================
# 💜 MEMORY STORE (V9)
# ==========================================

MEMORY_FILE=".github/.agent_memory.json"

init_memory() {
  if [ ! -f "$MEMORY_FILE" ]; then
    echo "{}" > "$MEMORY_FILE"
    echo "[MEMORY] Initialized new memory store"
  fi
}

get_memory() {
  local key="$1"
  jq -r --arg k "$key" '.[$k] // empty' "$MEMORY_FILE"
}

set_memory() {
  local key="$1"
  local value="$2"

  tmp=$(mktemp)
  jq --arg k "$key" --arg v "$value" '.[$k]=$v' "$MEMORY_FILE" > "$tmp"
  mv "$tmp" "$MEMORY_FILE"

  echo "[MEMORY] Saved $key → $value"
}