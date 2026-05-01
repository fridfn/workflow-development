#!/bin/bash

MEMORY_FILE=".github/scripts/agent/brain/.agent.memory.json"

# =========================
# 🔹 LOG SYSTEM (ENHANCED)
# =========================

get_time() {
  date +"%H:%M:%S"
}

log_memory() {
  local level="$1"
  local msg="$2"
  local time=$(get_time)
  echo "[$time][$level][MEMORY] $msg"
}

log_m_info()  { log_memory "INFO" "$1"; }
log_m_warn()  { log_memory "WARN" "$1"; }
log_m_debug() { log_memory "DEBUG" "$1"; }

log_m_section() {
  local title="$1"
  local time=$(get_time)
  echo ""
  echo "[$time][SECTION][MEMORY] =============================="
  echo "[$time][SECTION][MEMORY] 🧠 $title"
  echo "[$time][SECTION][MEMORY] =============================="
}

# =========================
# 🔹 INIT MEMORY
# =========================

init_memory() {
  log_m_section "INIT MEMORY"

  if [ ! -f "$MEMORY_FILE" ]; then
    echo "{}" > "$MEMORY_FILE"
    log_m_info "[INIT] New memory created"
  else
    log_m_debug "[INIT] File exists"
  fi

  if ! jq empty "$MEMORY_FILE" >/dev/null 2>&1; then
    log_m_warn "[INIT] Corrupted JSON → reset"
    echo "{}" > "$MEMORY_FILE"
  fi

  log_m_info "[INIT] JSON valid ✔"
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
# 🔹 SET MEMORY
# =========================

set_memory() {
  local path="$1"
  local value="$2"

  log_m_section "SET MEMORY"

  log_m_info "[SET] $path = $value"

  init_memory

  IFS='.' read -ra keys <<< "$path"
  tmp=$(mktemp)

  jq_script="."

  for key in "${keys[@]:0:${#keys[@]}-1}"; do
    jq_script="$jq_script[\"$key\"] |= (. // {})"
  done

  last_key="${keys[-1]}"
  jq_script="$jq_script | $jq_script[\"$last_key\"] = \$v"

  log_m_debug "[SCRIPT] $jq_script"

  jq --arg v "$value" "$jq_script" "$MEMORY_FILE" > "$tmp" \
    && mv "$tmp" "$MEMORY_FILE"

  log_m_info "[SET] Success ✔"
}

# =========================
# 🔹 GET MEMORY
# =========================

get_memory() {
  local path="$1"

  log_m_section "GET MEMORY"

  log_m_info "[GET] Path → $path"

  init_memory

  value=$(jq -r "$(build_jq_path "$path") // empty" "$MEMORY_FILE")

  log_m_debug "[RESULT] ${value:-<empty>}"
  echo "$value"
}

# =========================
# 🔹 PUSH HISTORY
# =========================

push_history() {
  local path="$1"
  local value="$2"
  local limit="${3:-5}"

  log_m_section "PUSH HISTORY"

  log_m_info "[HISTORY] Path → $path"
  log_m_debug "[HISTORY] Value → $value"
  log_m_debug "[HISTORY] Limit → $limit"

  init_memory
  tmp=$(mktemp)

  jq --arg p "$path" --arg v "$value" --argjson limit "$limit" '
    ($p | split(".")) as $keys
    | (getpath($keys) // []) as $arr
    | setpath($keys; ([ $v ] + $arr)[:$limit])
  ' "$MEMORY_FILE" > "$tmp" \
    && mv "$tmp" "$MEMORY_FILE"

  log_m_info "[HISTORY] Updated ✔"
}

# =========================
# 🔹 CHECK HISTORY
# =========================

is_in_history() {
  local path="$1"
  local value="$2"

  log_m_section "CHECK HISTORY"

  log_m_info "[CHECK] Path → $path"

  init_memory

  exists=$(jq -r --arg p "$path" --arg v "$value" '
    ($p | split(".")) as $keys
    | (getpath($keys) // []) | index($v)
  ' "$MEMORY_FILE")

  if [ "$exists" != "null" ]; then
    log_m_warn "[HISTORY] DUPLICATE ❌"
    return 0
  else
    log_m_info "[HISTORY] OK ✔"
    return 1
  fi
}