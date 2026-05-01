#!/bin/bash

# ==========================================
# 🔁 RETRY ENGINE (SAFE VERSION)
# ==========================================

RETRY_MAX=5
RETRY_DELAY=0.2
RETRY_LOCK=0

# =========================
# 🔹 LOG SYSTEM (ENHANCED)
# =========================

get_time() {
  date +"%H:%M:%S"
}

log_retry() {
  local level="$1"
  local msg="$2"
  local time=$(get_time)
  echo "[$time][$level][RETRY] $msg" >&2
}

log_retry_info()  { log_retry "INFO" "$1"; }
log_retry_warn()  { log_retry "WARN" "$1"; }
log_retry_debug() { log_retry "DEBUG" "$1"; }

log_retry_section() {
  local title="$1"
  local time=$(get_time)
  echo "" >&2
  echo "[$time][SECTION][RETRY] ==============================" >&2
  echo "[$time][SECTION][RETRY] 🔁 $title" >&2
  echo "[$time][SECTION][RETRY] ==============================" >&2
}

# =========================
# 🔁 RETRY FUNCTION
# =========================

retry_generate() {
  local agent="$1"
  local original="$2"
  local generator="$3"

  # 🔒 prevent recursive retry
  if [ "$RETRY_LOCK" -eq 1 ]; then
    log_retry_warn "[LOCK] Prevent recursive retry"
    return 1
  fi

  RETRY_LOCK=1

  log_retry_section "START RETRY ENGINE → $agent"

  for ((i=1; i<=RETRY_MAX; i++)); do
    log_retry_info "[TRY] $i / $RETRY_MAX"

    # 🧠 regenerate WITHOUT recursion
    new=$($generator 2>/dev/null)

    reply=$(echo "$new" | jq -r '.reply')

    if [ -z "$reply" ] || [ "$reply" = "null" ]; then
      log_retry_warn "[RESULT] Empty → retrying..."
      sleep "$RETRY_DELAY"
      continue
    fi

    if [ "$reply" != "$original" ]; then
      log_retry_info "[SUCCESS] New message found"
      RETRY_LOCK=0

      log_retry_debug "[OUTPUT] Generated JSON:"
      echo "$new" | jq '.' >&2

      echo "$new"
      return 0
    fi

    log_retry_warn "[RESULT] Duplicate → retrying..."
    sleep "$RETRY_DELAY"
  done

  log_retry_warn "[FAILED] Max retry reached"
  RETRY_LOCK=0
  return 1
}