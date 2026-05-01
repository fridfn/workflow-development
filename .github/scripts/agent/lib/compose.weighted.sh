#!/bin/bash

# ==========================================
# 💜 WEIGHTED COMPOSE CONTROLLER (SAFE + TRACE)
# ==========================================

source ".github/scripts/agent/lib/weighted.gacha.sh"

# =========================
# 🔹 LOG SYSTEM (ENHANCED)
# =========================

get_time() {
  date +"%H:%M:%S"
}

log_weight() {
  local level="$1"
  local msg="$2"
  local time=$(get_time)
  echo "[$time][$level][WEIGHTED][COMPOSE] $msg" >&2
}

log_w_info()  { log_weight "INFO" "$1"; }
log_w_warn()  { log_weight "WARN" "$1"; }
log_w_debug() { log_weight "DEBUG" "$1"; }

log_w_section() {
  local title="$1"
  local time=$(get_time)
  echo "" >&2
  echo "[$time][SECTION][WEIGHTED][COMPOSE] ==============================" >&2
  echo "[$time][SECTION][WEIGHTED][COMPOSE] 🎲 $title" >&2
  echo "[$time][SECTION][WEIGHTED][COMPOSE] ==============================" >&2
}

# =========================
# 🎲 APPLY FUNCTION
# =========================

apply_weighted_compose() {
  local weights="${COMPOSE_WEIGHTS:-}"

  log_w_section "INIT"

  log_w_info "[ENV] COMPOSE_WEIGHTS=$COMPOSE_WEIGHTS"
  
  if [ -z "$weights" ]; then
    log_w_warn "[INIT] No COMPOSE_WEIGHTS provided → skip"
    return
  fi

  log_w_debug "[INPUT] Raw Weights → $weights"

  # =========================
  # 🔍 STEP 2 → VALIDASI JSON
  # =========================

  log_w_section "STEP 2 → VALIDATE JSON"

  echo "$weights" | jq . >/dev/null 2>&1
  if [ $? -ne 0 ]; then
    log_w_warn "[VALIDATION] Invalid JSON ❌"
    log_w_debug "[PAYLOAD] $weights"
    log_w_warn "[FALLBACK] Skip weighted compose"
    return
  fi

  log_w_info "[VALIDATION] JSON valid ✔"

  # =========================
  # 🎲 STEP 3 → GACHA
  # =========================

  log_w_section "STEP 3 → GACHA"

  result=$(bash .github/scripts/agent/lib/weighted.gacha.sh "$weights")

  log_w_debug "[GACHA] Raw result → $result"

  if [ -z "$result" ]; then
    log_w_warn "[GACHA] Result empty ❌ → skip"
    return
  fi

  # =========================
  # 🧪 STEP 4 → SANITY CHECK
  # =========================

  log_w_section "STEP 4 → SANITY CHECK"

  if [ "$result" = "null" ]; then
    log_w_warn "[CHECK] Result = null ❌ → skip"
    return
  fi

  log_w_info "[CHECK] Result valid ✔"

  # =========================
  # 🚀 STEP 5 → APPLY
  # =========================

  log_w_section "STEP 5 → APPLY"

  export COMPOSE_MODE="$result"

  log_w_info "[APPLY] COMPOSE_MODE → $COMPOSE_MODE"
}