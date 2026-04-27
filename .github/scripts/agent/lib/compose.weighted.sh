#!/bin/bash

# ==========================================
# 💜 WEIGHTED COMPOSE CONTROLLER (V9.3)
# ==========================================
# Env:
#   COMPOSE_WEIGHTS → JSON
#
# Usage Example :
#   echo "COMPOSE_WEIGHTS={\"message,greeting\":10,\"greeting\":40,\"message\":50}" >> $GITHUB_ENV
# ==========================================

source ".github/scripts/agent/lib/weighted.gacha.sh"

log_weight() {
  echo "[WEIGHTED][COMPOSE] $1" >&2
}

apply_weighted_compose() {
  local weights="$COMPOSE_WEIGHTS"

  log_weight "Init weighted compose..."

  if [ -z "$weights" ]; then
    log_weight "No COMPOSE_WEIGHTS provided → skip"
    return
  fi

  log_weight "Weights → $weights"

  result=$(bash .github/scripts/lib/weighted.gacha.sh "$weights")

  if [ -z "$result" ]; then
    log_weight "Result empty → skip"
    return
  fi

  log_weight "Selected → $result"

  export COMPOSE_MODE="$result"
}