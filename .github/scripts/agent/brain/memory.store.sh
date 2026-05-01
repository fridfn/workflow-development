#!/bin/bash

# ==========================================
# 💜 MEMORY STORE (SAFE + VERBOSE + NESTED)
# ==========================================

MEMORY_FILE=".github/scripts/agent/brain/.agent.memory.json"

# =========================
# 🔹 LOG HELPERS
# =========================
log_memory() {
  echo "[MEMORY] $1"
}

log_step() {
  echo "[MEMORY][STEP] $1"
}

# =========================
# 🔹 INIT + GUARD
# =========================
init_memory() {
  log_step "INIT MEMORY"

  if [ ! -f "$MEMORY_FILE" ]; then
    echo "{}" > "$MEMORY_FILE"
    log_memory "[INIT] New memory store created"
  else
    log_memory "[INIT] Memory file exists"
  fi

  # ensure valid JSON object
  tmp=$(mktemp)
  jq 'if type=="object" then . else {} end' "$MEMORY_FILE" > "$tmp" 2>/dev/null

  if [ $? -ne 0 ]; then
    log_memory "[INIT][WARN] Corrupted JSON detected → reset"
    echo "{}" > "$MEMORY_FILE"
  else
    mv "$tmp" "$MEMORY_FILE"
    log_memory "[INIT] JSON validated ✔"
  fi
}

# =========================
# 🔹 BUILD PATH
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
# 🔍 GET
# =========================
get_memory() {
  local path="$1"

  log_step "GET MEMORY"
  log_memory "[GET] Path → $path"

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
# 💾 SET (AUTO TYPE DETECT)
# =========================
set_memory() {
  local path="$1"
  local value="$2"

  log_step "SET MEMORY"
  log_memory "[SET] Request → $path = $value"

  init_memory

  if [ -z "$path" ]; then
    log_memory "[SET][ERROR] Empty path"
    return 1
  fi

  IFS='.' read -ra keys <<< "$path"

  tmp=$(mktemp)
  jq_script="."

  log_memory "[SET] Building path..."

  # ensure parent object safely
  for key in "${keys[@]:0:${#keys[@]}-1}"; do
    jq_script="$jq_script[\"$key\"] |= (if type==\"object\" then . else {} end)"
  done

  last_key="${keys[-1]}"
  jq_script="$jq_script | $jq_script[\"$last_key\"] = \$v"

  log_memory "[SET] Final JQ SCRIPT → $jq_script"

  # detect JSON or string
  if echo "$value" | jq . >/dev/null 2>&1; then
    log_memory "[SET] Detected JSON value"
    jq --argjson v "$value" "$jq_script" "$MEMORY_FILE" > "$tmp"
  else
    log_memory "[SET] Detected STRING value"
    jq --arg v "$value" "$jq_script" "$MEMORY_FILE" > "$tmp"
  fi

  mv "$tmp" "$MEMORY_FILE"

  log_memory "[SET] Success ✔"
  log_memory "[SET] Current snapshot:"
  jq '.' "$MEMORY_FILE"
}

# =========================
# ➕ PUSH HISTORY
# =========================
push_history() {
  local path="$1"
  local value="$2"
  local limit="${3:-5}"

  log_step "PUSH HISTORY"
  log_memory "[HISTORY] Path → $path"
  log_memory "[HISTORY] Value → $value"
  log_memory "[HISTORY] Limit → $limit"

  init_memory

  tmp=$(mktemp)

  jq --arg p "$path" --arg v "$value" --argjson limit "$limit" '
    ($p | split(".")) as $keys
    | (try getpath($keys) catch []) as $arr
    | if ($arr | type) != "array" then
        setpath($keys; [$v])
      else
        setpath($keys; ([ $v ] + $arr)[:limit])
      end
  ' "$MEMORY_FILE" > "$tmp"

  mv "$tmp" "$MEMORY_FILE"

  log_memory "[HISTORY] Push success ✔"
  jq '.' "$MEMORY_FILE"
}

# =========================
# 🔁 CHECK DUPLICATE
# =========================
is_in_history() {
  local path="$1"
  local value="$2"

  log_step "CHECK DUPLICATE"
  log_memory "[CHECK] Path → $path"
  log_memory "[CHECK] Value → $value"

  init_memory

  exists=$(jq -r --arg p "$path" --arg v "$value" '
    ($p | split(".")) as $keys
    | (try getpath($keys) catch []) as $arr
    | if ($arr | type) != "array" then null else ($arr | index($v)) end
  ' "$MEMORY_FILE")

  if [ "$exists" != "null" ]; then
    log_memory "[CHECK] Duplicate FOUND ❌"
    return 0
  else
    log_memory "[CHECK] Not found ✔"
    return 1
  fi
}