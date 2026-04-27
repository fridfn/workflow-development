#!/bin/bash

# ==========================================
# 💜 CONTEXT AWARE SYSTEM
# ==========================================

get_time_context() {
  local hour=$(date +%H)

  if [ "$hour" -lt 12 ]; then
    echo "morning"
  elif [ "$hour" -lt 18 ]; then
    echo "afternoon"
  else
    echo "night"
  fi
}