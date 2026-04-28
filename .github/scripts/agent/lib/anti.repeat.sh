#!/bin/bash

# ==========================================
# 💜 ANTI REPEAT FILTER (SMART)
# ==========================================

source ".github/scripts/agent/brain/memory.store.sh"

filter_repeat() {
  local agent="$1"
  local text="$2"

  echo "[ANTI-REPEAT][$agent] Checking last message..."

  last=$(get_memory "$agent" "last_message")

  echo "[ANTI-REPEAT][$agent] Last:"
  echo "$last"

  if [ "$last" = "$text" ]; then
    echo "[ANTI-REPEAT][$agent] Duplicate detected"
    return 1
  fi

  set_memory "$agent" "last_message" "$text"
  push_history "$agent" "$text" 5

  echo "[ANTI-REPEAT][$agent] Accepted"
  return 0
}