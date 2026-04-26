#!/bin/bash

# ==========================================
# 💜 TELEGRAM SMART SENDER ENGINE (REUSABLE)
# ------------------------------------------
# Version   : 2.0
# Mode      : Safe (no fail workflow)
# Support   : Multi-agent + Parallel Execution
#
# Features:
# - Reusable function (smart_send)
# - Parallel safe (no shared state conflict)
# - Delivery mode:
#     • combined  → 1 message
#     • split     → greeting + message
#     • auto      → random (gacha)
# - Fallback handling
# - Structured logging
# - HTTP response tracking
#
# Required ENV:
#   TELEGRAM_TOKEN
#   TELEGRAM_CHANNEL_ID
#
# Optional ENV:
#   DELIVERY_MODE (combined/split/auto)
#   TEXT
#   GREETING
#   MESSAGE
#   AGENT_NAME (for logging)
#
# Usage:
#   source telegram.sender.sh
#   smart_send &
#
# ==========================================


# =========================
# 🔹 HEADER INFO
# =========================
print_header() {
  echo "==========================================" >&2
  echo "💜 TELEGRAM SENDER START" >&2
  echo "Agent   : ${AGENT_NAME:-unknown}" >&2
  echo "Time    : $(date '+%Y-%m-%d %H:%M:%S')" >&2
  echo "Mode    : ${DELIVERY_MODE:-combined}" >&2
  echo "==========================================" >&2
}


# =========================
# 🔹 LOG SYSTEM
# =========================
log() {
  local level="$1"
  local msg="$2"
  local agent="${AGENT_NAME:-core}"

  echo "[$level][$agent] $msg" >&2
}

log_info()  { log "INFO"  "$1"; }
log_warn()  { log "WARN"  "$1"; }
log_error() { log "ERROR" "$1"; }
log_debug() { log "DEBUG" "$1"; }


# =========================
# 🔹 SAFE EXIT
# =========================
safe_exit () {
  log_warn "$1"
  return 0 2>/dev/null || exit 0
}


# =========================
# 🔹 SEND FUNCTION
# =========================
send_message () {
  local text="$1"

  log_debug "Preparing request..."

  local response
  response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
    "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage" \
    -d chat_id="$TELEGRAM_CHANNEL_ID" \
    --data-urlencode "text=$textㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ")

  if [ "$response" != "200" ]; then
    log_warn "Telegram API responded with HTTP $response"
  else
    log_info "Message delivered (HTTP 200)"
  fi
}


# =========================
# 🚀 MAIN FUNCTION
# =========================
smart_send () {

  print_header

  # =========================
  # 🔹 VALIDATION
  # =========================
  log_info "Validating environment..."

  if [ -z "$TELEGRAM_TOKEN" ] || [ -z "$TELEGRAM_CHANNEL_ID" ]; then
    safe_exit "Missing TELEGRAM_TOKEN or TELEGRAM_CHANNEL_ID → skip"
  fi

  [ -z "$DELIVERY_MODE" ] && DELIVERY_MODE="combined"

  log_info "Delivery mode input: $DELIVERY_MODE"


  # =========================
  # 🔹 MODE RESOLUTION
  # =========================
  if [ "$DELIVERY_MODE" = "auto" ]; then
    local rand=$((RANDOM % 100))

    if [ "$rand" -lt 50 ]; then
      MODE="combined"
    else
      MODE="split"
    fi

    log_info "Auto mode selected → $MODE (roll=$rand)"

  else
    MODE="$DELIVERY_MODE"
    log_info "Fixed mode → $MODE"
  fi


  # =========================
  # 📤 DELIVERY LOGIC
  # =========================
  if [ "$MODE" = "combined" ]; then

    log_info "Executing COMBINED mode"

    if [ -z "$TEXT" ]; then
      if [ -n "$GREETING" ] && [ -n "$MESSAGE" ]; then
        TEXT="$GREETING

$MESSAGE"
        log_debug "Fallback combine applied"
      else
        safe_exit "No valid content → skip"
      fi
    fi

    log_debug "Sending combined message"
    send_message "$TEXT"


  else

    log_info "Executing SPLIT mode"

    if [ -z "$GREETING" ] || [ -z "$MESSAGE" ]; then
      safe_exit "Missing GREETING or MESSAGE → skip"
    fi

    log_debug "Sending greeting"
    send_message "$GREETING"

    local delay=$((RANDOM % 5 + 2))
    log_info "Delay before main message: ${delay}s"
    sleep "$delay"

    log_debug "Sending main message"
    send_message "$MESSAGE"

  fi


  # =========================
  # ✅ DONE
  # =========================
  log_info "Delivery finished 💜"
}