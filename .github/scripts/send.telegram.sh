#!/bin/bash

# ==========================================
# 💜 Telegram Sender Script
# ------------------------------------------
# Input  :
# TYPE      → combined / split
# TEXT      → (if combined)
# GREETING  → (if split)
# MESSAGE   → (if split)
#
# Output : send message to Telegram channel
#
# Flow:
# check type → send message
#           → (optional delay)
#           → send second message
# ==========================================


# =========================
# 🔗 TELEGRAM CREDENTIALS
# =========================

if [ -z "$TELEGRAM_TOKEN" ] || [ -z "$TELEGRAM_CHANNEL_ID" ]; then
  echo "[ERROR] Missing Telegram config" >&2
  exit 1
fi

# =========================
# 🔗 TELEGRAM CONFIG
# =========================
API_URL="https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage"
CHAT_ID="$TELEGRAM_CHANNEL_ID"


# =========================
# 🧠 INPUT INFO
# =========================
echo "[LOG] Sending message → TYPE=$TYPE" >&2


# =========================
# 📤 SEND COMBINED MESSAGE
# =========================
if [ "$TYPE" = "combined" ]; then
  
  echo "[LOG] Mode: combined" >&2
  
  curl -s -X POST "$API_URL" \
    -d chat_id="$CHAT_ID" \
    --data-urlencode "text=$TEXT
ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
"

# =========================
# 📤 SEND SPLIT MESSAGE
# =========================
else
  
  echo "[LOG] Mode: split (2 messages)" >&2

  # --- Greeting ---
  echo "[LOG] Sending greeting..." >&2
  curl -s -X POST "$API_URL" \
    -d chat_id="$CHAT_ID" \
    --data-urlencode "text=$GREETING
ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
"

  # --- Random Delay ---
  delay=$((RANDOM % 260 + 50))
  echo "[LOG] Delay before message: ${delay}s" >&2
  sleep $delay

  # --- Message ---
  echo "[LOG] Sending main message..." >&2
  curl -s -X POST "$API_URL" \
    -d chat_id="$CHAT_ID" \
    --data-urlencode "text=$MESSAGE
ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
"

fi



# =========================
# 📤 CHECK STATUS MESSAGE
# =========================
response=$(curl -s -o /dev/null -w "%{http_code}" ...)

if [ "$response" != "200" ]; then
  echo "[ERROR] Failed to send message (HTTP $response)" >&2
fi