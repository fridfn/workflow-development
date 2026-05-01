#!/bin/bash

# ==========================================
# 🎲 GENERIC WEIGHTED GACHA ENGINE (TRACE v2)
# ==========================================

# =========================
# 🔹 LOG SYSTEM (ENHANCED)
# =========================

get_time() {
  date +"%H:%M:%S"
}

log() {
  local level="$1"
  local step="$2"
  local msg="$3"
  local time=$(get_time)
  echo "[$time][$level][GACHA][STEP $step] $msg" >&2
}

log_info()  { log "INFO"  "$1" "$2"; }
log_debug() { log "DEBUG" "$1" "$2"; }
log_error() { log "ERROR" "$1" "$2"; }

# =========================
# 🔹 INPUT
# =========================

STEP=1
WEIGHTS_JSON=$COMPOSE_WEIGHTS

log_info $STEP "[INIT] Start Weighted Gacha Engine"

if [ -z "$WEIGHTS_JSON" ]; then
  log_error $STEP "[INIT] No weights provided → exit"
  exit 1
fi

log_debug $STEP "[INPUT] Raw JSON → $WEIGHTS_JSON"

# =========================
# 🔹 VALIDATE JSON
# =========================

STEP=2

if ! echo "$WEIGHTS_JSON" | jq empty >/dev/null 2>&1; then
  log_error $STEP "[VALIDATION] Invalid JSON format"
  exit 1
fi

log_info $STEP "[VALIDATION] JSON passed ✔"

# =========================
# 🔹 TOTAL WEIGHT
# =========================

STEP=3

TOTAL=$(echo "$WEIGHTS_JSON" | jq '[.[]] | add')

if [ -z "$TOTAL" ] || [ "$TOTAL" -le 0 ]; then
  log_error $STEP "[CALC] Invalid total weight → $TOTAL"
  exit 1
fi

log_info $STEP "[CALC] Total weight → $TOTAL"

# =========================
# 🔹 ROLL
# =========================

STEP=4

ROLL=$((RANDOM % TOTAL))

log_info $STEP "[ROLL] Random → $ROLL (0-$((TOTAL-1)))"

# =========================
# 🔹 ITERATION / PICK
# =========================

STEP=5

ACC=0
INDEX=0

log_info $STEP "[PICK] Start traversal..."

RESULT=$(echo "$WEIGHTS_JSON" | jq -r 'keys[]' | while read -r key; do

  INDEX=$((INDEX + 1))

  weight=$(echo "$WEIGHTS_JSON" | jq -r --arg k "$key" '.[$k]')
  next=$((ACC + weight))

  log_debug $STEP "[CHECK][$INDEX] '$key' → $weight ($ACC-$((next-1)))"

  if [ "$ROLL" -ge "$ACC" ] && [ "$ROLL" -lt "$next" ]; then
    log_info $STEP "[MATCH] '$key'"
    echo "$key"
    break
  fi

  ACC=$next

done)

# =========================
# 🔹 FINAL RESULT
# =========================

STEP=6

if [ -z "$RESULT" ]; then
  log_error $STEP "[FINAL] No result selected (unexpected)"
  exit 1
fi

log_info $STEP "[FINAL] Result → $RESULT"

# =========================
# 🔹 OUTPUT
# =========================

STEP=7

log_info $STEP "[OUTPUT] Emit to stdout"

echo "$RESULT"