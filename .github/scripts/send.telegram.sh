#!/bin/bash

# ==========================================
# 💜 Telegram Smart Sender (Safe Mode)
# ------------------------------------------
# Fungsi:
# Mengirim pesan ke Telegram dengan mode:
# - combined → 1 pesan
# - split    → greeting + message
# - auto     → random (gacha)
#
# Behavior:
# - Tidak akan fail workflow (safe exit)
# - Skip jika data tidak valid
# - Mendukung fallback combine
#
# ENV:
#   DELIVERY_MODE → combined / split / auto
#   TEXT
#   GREETING
#   MESSAGE
#   TELEGRAM_TOKEN
#   TELEGRAM_CHANNEL_ID
#
# Output:
#   Log terstruktur + status pengiriman
#
# ==========================================


# =========================
# 🔹 LOG SYSTEM
# =========================
log_info() {
  echo "[INFO] $1" >&2
}

log_warn() {
  echo "[WARN] $1" >&2
}

log_error() {
  echo "[ERROR] $1" >&2
}

log_debug() {
  echo "[DEBUG] $1" >&2
}


# =========================
# 🔹 SAFE EXIT (NO FAIL)
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

  log_debug "Sending payload..."
  
  response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
    "https://api.telegram.org/bot$TELEGRAM_TOKEN_AURIELLE/sendMessage" \
    -d chat_id="$TELEGRAM_CHANNEL_ID" \
    --data-urlencode "text=$text")

  if [ "$response" != "200" ]; then
    log_warn "Telegram API responded with HTTP $response"
  else
    log_info "Message sent successfully"
  fi
}


# =========================
# 🚀 START
# =========================
log_info "Smart delivery started"


# =========================
# 🔹 VALIDATION BASE
# =========================
if [ -z "$TELEGRAM_TOKEN_AURIELLE" ] || [ -z "$TELEGRAM_CHANNEL_ID" ]; then
  safe_exit "Missing Telegram credentials → skip"
fi

[ -z "$DELIVERY_MODE" ] && DELIVERY_MODE="combined"

log_info "Delivery mode: $DELIVERY_MODE"


# =========================
# 🔹 AUTO MODE (GACHA)
# =========================
if [ "$DELIVERY_MODE" = "auto" ]; then
  rand=$((RANDOM % 100))

  if [ "$rand" -lt 50 ]; then
    MODE="combined"
  else
    MODE="split"
  fi

  log_info "Auto selected mode → $MODE (roll=$rand)"

else
  MODE="$DELIVERY_MODE"
  log_info "Fixed mode → $MODE"
fi


# =========================
# 📤 SEND LOGIC
# =========================
if [ "$MODE" = "combined" ]; then

  log_info "Executing combined mode"

  if [ -z "$TEXT" ]; then
    if [ -n "$GREETING" ] && [ -n "$MESSAGE" ]; then
      TEXT="$GREETING

$MESSAGE"
      log_debug "Fallback: combine greeting + message"
    else
      safe_exit "No valid content for combined → skip"
    fi
  fi

  send_message "$TEXT"


else

  log_info "Executing split mode"

  if [ -z "$GREETING" ] || [ -z "$MESSAGE" ]; then
    safe_exit "Missing GREETING or MESSAGE → skip"
  fi

  log_debug "Sending greeting"
  send_message "$GREETING"

  delay=$((RANDOM % 5 + 2))
  log_info "Delay before main message: ${delay}s"
  sleep $delay

  log_debug "Sending main message"
  send_message "$MESSAGE"

fi


# =========================
# ✅ DONE
# =========================
log_info "Smart delivery finished 💜"