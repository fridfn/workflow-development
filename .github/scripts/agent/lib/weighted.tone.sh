#!/bin/bash

# ==========================================
# 💜 WEIGHTED TONE PICKER
# ==========================================

pick_weighted_index() {
  local total="$1"

  # simple bias: favor lower index (more "default personality")
  local r=$((RANDOM % 100))

  if [ "$r" -lt 50 ]; then
    echo 0
  else
    echo $((RANDOM % total))
  fi
}