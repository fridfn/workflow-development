#!/bin/bash

# ==========================================
# 💜 MEMORY V2 (MULTI AGENT + ADAPTIVE)
# ==========================================

MEMORY_FILE=".github/scripts/agent/brain/.agent.memory.json"
HISTORY_LIMIT=5

log_mem() {
  echo "[MEMORY_V2] $1"
}

init_memory_v2() {
  if [ ! -f "$MEMORY_FILE" ]; then
    echo "{}" > "$MEMORY_FILE"
    log_mem "Initialized memory store"
  fi
}

# =========================
# 🔹 GENERATE KEY (AUTO)
# =========================
gen_key() {
  local agent="$1"
  local field="$2"
  echo "${agent}_${field}"
}

# =========================
# 🔹 GET
# =========================
mem_get() {
  local key="$1"
  jq -r --arg k "$key" '.[$k] // empty' "$MEMORY_FILE"
}

# =========================
# 🔹 SET
# =========================
mem_set() {
  local key="$1"
  local value="$2"

  tmp=$(mktemp)
  jq --arg k "$key" --arg v "$value" '.[$k]=$v' "$MEMORY_FILE" > "$tmp"
  mv "$tmp" "$MEMORY_FILE"

  log_mem "SET → $key"
}

# =========================
# 🔹 PUSH HISTORY
# =========================
mem_push_history() {
  local agent="$1"
  local value="$2"

  local key
  key=$(gen_key "$agent" "history")

  local current
  current=$(mem_get "$key")

  # convert ke array
  if [ -z "$current" ]; then
    current="[]"
  fi

  updated=$(echo "$current" | jq --arg v "$value" \
    ". + [\$v] | .[-$HISTORY_LIMIT:]")

  tmp=$(mktemp)
  jq --arg k "$key" --argjson v "$updated" '.[$k]=$v' "$MEMORY_FILE" > "$tmp"
  mv "$tmp" "$MEMORY_FILE"

  log_mem "HISTORY PUSH → $agent"
}

# =========================
# 🔹 CHECK DUPLICATE (ADV)
# =========================
mem_is_duplicate() {
  local agent="$1"
  local value="$2"

  local key
  key=$(gen_key "$agent" "history")

  local history
  history=$(mem_get "$key")

  echo "$history" | jq -e --arg v "$value" 'index($v)' > /dev/null

  if [ $? -eq 0 ]; then
    log_mem "DUPLICATE DETECTED"
    return 0
  else
    log_mem "UNIQUE MESSAGE"
    return 1
  fi
}