#!/bin/bash

# ==========================================
# 💜 RETRY ENGINE (SMART VARIATION FINDER)
# ==========================================

MAX_RETRY=5

retry_generate() {
  local agent="$1"
  local original_reply="$2"
  local generator_func="$3"

  echo "[RETRY] Starting retry engine for $agent"
  echo "[RETRY] Max attempts: $MAX_RETRY"

  local attempt=1
  local new_reply="$original_reply"

  while [ $attempt -le $MAX_RETRY ]; do

    echo "[RETRY] Attempt $attempt"

    # Generate new seed
    export SEED_GREET=$RANDOM
    export SEED_MSG=$RANDOM

    echo "[RETRY] New seed → greet=$SEED_GREET msg=$SEED_MSG"

    # Re-run generator (pakai function reference)
    new_reply=$($generator_func)

    echo "[RETRY] Generated:"
    echo "$new_reply"

    # Compare
    if [ "$new_reply" != "$original_reply" ]; then
      echo "[RETRY] ✅ Found different message"
      echo "$new_reply"
      return 0
    fi

    echo "[RETRY] ❌ Still duplicate"
    attempt=$((attempt+1))
  done

  echo "[RETRY] ⚠️ Max retry reached → fallback"
  return 1
}