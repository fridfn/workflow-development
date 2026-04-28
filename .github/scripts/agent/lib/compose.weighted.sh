#!/bin/bash

# ==========================================
# 💜 WEIGHTED COMPOSE CONTROLLER (SAFE + TRACE)
# ==========================================

source ".github/scripts/agent/lib/weighted.gacha.sh"

log_weight() {
  echo "[WEIGHTED][COMPOSE] $1" >&2
}

apply_weighted_compose() {
  local weights="$COMPOSE_WEIGHTS"

  log_weight "=============================="
  log_weight "STEP 1 → INIT"
  log_weight "=============================="

  log_weight "Value weights → $weights"
  
  if [ -z "$weights" ]; then
    log_weight "No COMPOSE_WEIGHTS provided → skip"
    return
  fi

  log_weight "Raw Weights → $weights"

  # =========================
  # 🔍 STEP 2 → VALIDASI JSON
  # =========================
  log_weight "STEP 2 → Validate JSON"

  echo "$weights" | jq . >/dev/null 2>&1
  if [ $? -ne 0 ]; then
    log_weight "Invalid JSON detected ❌"
    log_weight "Payload → $weights"
    log_weight "Fallback → skip weighted compose"
    return
  fi

  log_weight "JSON valid ✔"

  # =========================
  # 🎲 STEP 3 → GACHA
  # =========================
  log_weight "STEP 3 → Run weighted gacha"

  result=$(bash .github/scripts/agent/lib/weighted.gacha.sh "$weights")

  log_weight "Raw result → $result"

  if [ -z "$result" ]; then
    log_weight "Result empty ❌ → skip"
    return
  fi

  # =========================
  # 🧪 STEP 4 → SANITY CHECK
  # =========================
  log_weight "STEP 4 → Sanity check result"

  if [ "$result" = "null" ]; then
    log_weight "Result = null ❌ → skip"
    return
  fi

  log_weight "Result valid ✔"

  # =========================
  # 🚀 STEP 5 → APPLY
  # =========================
  log_weight "STEP 5 → Apply COMPOSE_MODE"

  export COMPOSE_MODE="$result"

  log_weight "COMPOSE_MODE set → $COMPOSE_MODE"
}