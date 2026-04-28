#!/bin/bash

# ==========================================
# 💜 MEMORY STORE (NESTED SYSTEM)
# ==========================================

MEMORY_FILE=".github/scripts/agent/.agent_memory.json"

log_memory() {
  echo "[MEMORY] $1"
}

init_memory() {
  if [ ! -f "$MEMORY_FILE" ]; then
    echo "{}" > "$MEMORY_FILE"
    log_memory "Initialized new memory store"
  else
    log_memory "Memory store found"
  fi
}

# =========================
# 🔍 GET
# =========================
get_memory() {
  local agent="$1"
  local field="$2"

  init_memory

  value=$(jq -r --arg a "$agent" --arg f "$field" \
    '.[$a][$f] // empty' "$MEMORY_FILE")

  log_memory "GET → $agent.$field = ${value:-<empty>}"

  echo "$value"
}

# =========================
# 💾 SET
# =========================
set_memory() {
  local agent="$1"
  local field="$2"
  local value="$3"

  init_memory

  tmp=$(mktemp)

  jq --arg a "$agent" --arg f "$field" --arg v "$value" '
    .[$a] = (.[$a] // {})
    | .[$a][$f] = $v
  ' "$MEMORY_FILE" > "$tmp"

  mv "$tmp" "$MEMORY_FILE"

  log_memory "SET → $agent.$field = $value"
}

# =========================
# ➕ PUSH HISTORY
# =========================
push_history() {
  local agent="$1"
  local value="$2"
  local limit="${3:-5}"

  init_memory

  tmp=$(mktemp)

  jq --arg a "$agent" --arg v "$value" --argjson limit "$limit" '
    .[$a] = (.[$a] // {})
    | .[$a].history = (.[$a].history // [])
    | .[$a].history = ([ $v ] + .[$a].history)[:$limit]
  ' "$MEMORY_FILE" > "$tmp"

  mv "$tmp" "$MEMORY_FILE"

  log_memory "PUSH HISTORY → $agent (limit=$limit)"
}

# =========================
# 🔁 CHECK DUPLICATE HISTORY
# =========================
is_in_history() {
  local agent="$1"
  local value="$2"

  init_memory

  exists=$(jq -r --arg a "$agent" --arg v "$value" '
    (.[$a].history // []) | index($v)
  ' "$MEMORY_FILE")

  if [ "$exists" != "null" ]; then
    log_memory "HISTORY DUPLICATE → $agent"
    return 0
  else
    log_memory "HISTORY OK → $agent"
    return 1
  fi
}