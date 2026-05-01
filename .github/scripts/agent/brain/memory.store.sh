#!/bin/bash

MEMORY_FILE=".github/scripts/agent/brain/.agent.memory.json"

log_memory() {
  echo "[MEMORY] $1"
}

init_memory() {
  log_memory "[STEP] INIT MEMORY"

  if [ ! -f "$MEMORY_FILE" ]; then
    echo "{}" > "$MEMORY_FILE"
    log_memory "[INIT] New memory created"
  else
    log_memory "[INIT] File exists"
  fi

  if ! jq empty "$MEMORY_FILE" >/dev/null 2>&1; then
    log_memory "[INIT][FIX] Corrupted JSON → reset"
    echo "{}" > "$MEMORY_FILE"
  fi

  log_memory "[INIT] JSON valid ✔"
}

build_jq_path() {
  local path="$1"
  IFS='.' read -ra keys <<< "$path"

  jq_path="."
  for key in "${keys[@]}"; do
    jq_path="$jq_path[\"$key\"]"
  done

  echo "$jq_path"
}

set_memory() {
  local path="$1"
  local value="$2"

  log_memory "[STEP] SET MEMORY"
  log_memory "[SET] $path = $value"

  init_memory

  IFS='.' read -ra keys <<< "$path"
  tmp=$(mktemp)

  jq_script="."

  for key in "${keys[@]:0:${#keys[@]}-1}"; do
    jq_script="$jq_script[\"$key\"] |= (. // {})"
  done

  last_key="${keys[-1]}"
  jq_script="$jq_script | $jq_script[\"$last_key\"] = \$v"

  log_memory "[SET] SCRIPT → $jq_script"

  jq --arg v "$value" "$jq_script" "$MEMORY_FILE" > "$tmp" \
    && mv "$tmp" "$MEMORY_FILE"

  log_memory "[SET] Success ✔"
}

get_memory() {
  local path="$1"

  log_memory "[STEP] GET MEMORY → $path"
  init_memory

  value=$(jq -r "$(build_jq_path "$path") // empty" "$MEMORY_FILE")

  log_memory "[GET] Result → ${value:-<empty>}"
  echo "$value"
}

push_history() {
  local path="$1"
  local value="$2"
  local limit="${3:-5}"

  log_memory "[STEP] PUSH HISTORY → $path"

  init_memory
  tmp=$(mktemp)

  jq --arg p "$path" --arg v "$value" --argjson limit "$limit" '
    ($p | split(".")) as $keys
    | (getpath($keys) // []) as $arr
    | setpath($keys; ([ $v ] + $arr)[:$limit])
  ' "$MEMORY_FILE" > "$tmp" \
    && mv "$tmp" "$MEMORY_FILE"

  log_memory "[HISTORY] Updated ✔"
}

is_in_history() {
  local path="$1"
  local value="$2"

  log_memory "[STEP] CHECK HISTORY → $path"

  init_memory

  exists=$(jq -r --arg p "$path" --arg v "$value" '
    ($p | split(".")) as $keys
    | (getpath($keys) // []) | index($v)
  ' "$MEMORY_FILE")

  if [ "$exists" != "null" ]; then
    log_memory "[HISTORY] DUPLICATE ❌"
    return 0
  else
    log_memory "[HISTORY] OK ✔"
    return 1
  fi
}