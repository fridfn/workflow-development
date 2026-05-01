#!/bin/bash

# ==========================================
# 🔁 RETRY ENGINE (SAFE VERSION)
# ==========================================

RETRY_MAX=5
RETRY_DELAY=0.2
RETRY_LOCK=0

log_retry() {
  echo "[RETRY] $1" >&2
}

retry_generate() {
  local agent="$1"
  local original="$2"
  local generator="$3"

  # 🔒 prevent recursive retry
  if [ "$RETRY_LOCK" -eq 1 ]; then
    log_retry "LOCKED → prevent recursive retry"
    return 1
  fi

  RETRY_LOCK=1

  log_retry "=============================="
  log_retry "START RETRY ENGINE ($agent)"
  log_retry "=============================="

  for ((i=1; i<=RETRY_MAX; i++)); do
    log_retry "TRY $i / $RETRY_MAX"

    # 🧠 regenerate WITHOUT recursion
    new=$($generator 2>/dev/null)

    reply=$(echo "$new" | jq -r '.reply')

    if [ -z "$reply" ] || [ "$reply" = "null" ]; then
      log_retry "EMPTY result → retrying..."
      sleep "$RETRY_DELAY"
      continue
    fi

    if [ "$reply" != "$original" ]; then
      log_retry "SUCCESS → new message found"
      RETRY_LOCK=0
    
      log_retry "Generated:"
      echo "$new" | jq '.' >&2
    
      echo "$new"   # 🔥 INI WAJIB
      return 0
    fi

    log_retry "DUPLICATE → retrying..."
    sleep "$RETRY_DELAY"
  done

  log_retry "FAILED → max retry reached"
  RETRY_LOCK=0
  return 1
}