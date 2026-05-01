#!/bin/bash

# ==========================================
# 💜 MEMORY STORE (MODERN NESTED SYSTEM)
# ==========================================

MEMORY_FILE=".github/scripts/agent/brain/.agent.memory.json"

# =========================
# 🔹 LOG
# =========================
log_memory() {
  echo "[MEMORY] $1"
}

# =========================
# 🔹 INIT
# =========================
init_memory() {
  if [ ! -f "$MEMORY_FILE" ]; then
    echo "{}" > "$MEMORY_FILE"
    log_memory "[INIT] New memory store created"
  else
    log_memory "[INIT] Memory store ready"
  fi
}

# =========================
# 🔹 INTERNAL: BUILD JQ PATH
# =========================
build_jq_path() {
  local path="$1"

  IFS='.' read -ra keys <<< "$path"

  jq_path="."

  for key in "${keys[@]}"; do
    jq_path="$jq_path[\"$key\"]"
  done

  echo "$jq_path"
}

# =========================
# 🔍 GET (NESTED)
# =========================
get_memory() {
  local path="$1"

  log_memory "[GET] Request → $path"

  init_memory

  if [ -z "$path" ]; then
    log_memory "[GET][ERROR] Empty path"
    echo ""
    return 1
  fi

  jq_path=$(build_jq_path "$path")

  log_memory "[GET] JQ PATH → $jq_path"

  value=$(jq -r "$jq_path // empty" "$MEMORY_FILE")

  log_memory "[GET] Result → ${value:-<empty>}"

  echo "$value"
}

# =========================
# 💾 SET (NESTED AUTO CREATE)
# =========================
set_memory() {
  local path="$1"
  local value="$2"

  log_memory "[SET] Request → $path = $value"

  init_memory

  if [ -z "$path" ]; then
    log_memory "[SET][ERROR] Empty path"
    return 1
  fi

  IFS='.' read -ra keys <<< "$path"

  tmp=$(mktemp)

  jq_script="."

  # build parent safely
  for key in "${keys[@]:0:${#keys[@]}-1}"; do
    jq_script="$jq_script[\"$key\"] |= (. // {})"
  done

  last_key="${keys[-1]}"
  jq_script="$jq_script | $jq_script[\"$last_key\"] = \$v"

  log_memory "[SET] JQ SCRIPT → $jq_script"

  jq --arg v "$value" "$jq_script" "$MEMORY_FILE" > "$tmp"

  mv "$tmp" "$MEMORY_FILE"

  log_memory "[SET] Success ✔"
}

# =========================
# ➕ PUSH HISTORY
# =========================
push_history() {
  local path="$1"
  local value="$2"
  local limit="${3:-5}"

  log_memory "[HISTORY][PUSH] → $path"

  init_memory

  tmp=$(mktemp)

  jq --arg p "$path" --arg v "$value" --argjson limit "$limit" '
    def setpath_safe(p; v):
      setpath(p; (getpath(p) // v));

    def push_hist(p; v; limit):
      (getpath(p) // []) as $arr
      | setpath(p; ([v] + $arr)[:limit]);

    ($p | split(".")) as $keys
    | push_hist($keys; $v; $limit)
  ' "$MEMORY_FILE" > "$tmp"

  mv "$tmp" "$MEMORY_FILE"

  log_memory "[HISTORY][PUSH] Done ✔"
}

# =========================
# 🔁 CHECK DUPLICATE HISTORY
# =========================
is_in_history() {
  local path="$1"
  local value="$2"

  log_memory "[HISTORY][CHECK] → $path"

  init_memory

  exists=$(jq -r --arg p "$path" --arg v "$value" '
    ($p | split(".")) as $keys
    | (getpath($keys) // []) | index($v)
  ' "$MEMORY_FILE")

  if [ "$exists" != "null" ]; then
    log_memory "[HISTORY][DUPLICATE] Found"
    return 0
  else
    log_memory "[HISTORY][OK] Not found"
    return 1
  fi
}