#!/bin/bash

# ==========================================
# 🎲 GENERIC WEIGHTED GACHA ENGINE (TRACE v2)
# ==========================================
# Input:
#   JSON string (weights map)
#
# Example:
#   '{"default":70,"greeting":15,"message":15}'
#   '{"greeting,message":80,"greeting":10,"message":10}'
# Output:
#   echo "default"
# ==========================================

# =========================
# 🔹 LOG SYSTEM
# =========================
log() {
  local level="$1"
  local step="$2"
  local msg="$3"
  echo "[$level][STEP $step][GACHA] $msg" >&2
}

log_info()  { log "INFO"  "$1" "$2"; }
log_debug() { log "DEBUG" "$1" "$2"; }
log_error() { log "ERROR" "$1" "$2"; }

# =========================
# 🔹 INPUT
# =========================
STEP=1
WEIGHTS_JSON=$COMPOSE_WEIGHTS

log_info $STEP "Start Weighted Gacha Engine"

if [ -z "$WEIGHTS_JSON" ]; then
  log_error $STEP "No weights provided → exit"
  exit 1
fi

log_debug $STEP "Raw input JSON → $WEIGHTS_JSON"

# =========================
# 🔹 VALIDATE JSON
# =========================
STEP=2

if ! echo "$WEIGHTS_JSON" | jq empty >/dev/null 2>&1; then
  log_error $STEP "Invalid JSON format"
  exit 1
fi

log_info $STEP "JSON validation passed"

# =========================
# 🔹 TOTAL WEIGHT
# =========================
STEP=3

TOTAL=$(echo "$WEIGHTS_JSON" | jq '[.[]] | add')

if [ -z "$TOTAL" ] || [ "$TOTAL" -le 0 ]; then
  log_error $STEP "Invalid total weight → $TOTAL"
  exit 1
fi

log_info $STEP "Total weight calculated → $TOTAL"

# =========================
# 🔹 ROLL
# =========================
STEP=4

ROLL=$((RANDOM % TOTAL))

log_info $STEP "Random roll generated → $ROLL (range: 0-$((TOTAL-1)))"

# =========================
# 🔹 ITERATION / PICK
# =========================
STEP=5

ACC=0
INDEX=0

log_info $STEP "Start weight traversal..."

RESULT=$(echo "$WEIGHTS_JSON" | jq -r 'keys[]' | while read -r key; do

  INDEX=$((INDEX + 1))

  weight=$(echo "$WEIGHTS_JSON" | jq -r --arg k "$key" '.[$k]')
  next=$((ACC + weight))

  log_debug $STEP "[$INDEX] Key='$key' Weight=$weight Range=$ACC-$((next-1))"

  if [ "$ROLL" -ge "$ACC" ] && [ "$ROLL" -lt "$next" ]; then
    log_info $STEP "Matched → '$key'"
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
  log_error $STEP "No result selected (unexpected)"
  exit 1
fi

log_info $STEP "Final result → $RESULT"

# =========================
# 🔹 OUTPUT
# =========================
STEP=7

log_info $STEP "Emit result to stdout"

echo "$RESULT"