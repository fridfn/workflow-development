#!/bin/bash

# ==========================================
# 💜 ANTI REPEAT FILTER
# ==========================================

source ".github/scripts/agent/lib/memory.store.sh"

filter_repeat() {
  local agent="$1"
  local text="$2"

  init_memory

  last=$(get_memory "${agent}_last_message")

  echo "[ANTI-REPEAT] Last message:"
  echo "$last"

  if [ "$last" = "$text" ]; then
    echo "[ANTI-REPEAT] Duplicate detected → skipping"
    return 1
  fi

  set_memory "${agent}_last_message" "$text"
  echo "[ANTI-REPEAT] Message accepted"
  return 0
}