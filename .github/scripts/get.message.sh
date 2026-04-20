#!/bin/bash

# ==========================================
# 💜 Message Generator Script
# ------------------------------------------
# Input  : $mode_message (json file name)
#          $mode (time / condition mode)
#
# Output :
# TYPE=combined → TEXT
# TYPE=split    → GREETING + MESSAGE
#
# Flow:
# load json → pick tone → pick greeting/message
#           → validate → random output format
# ==========================================


# =========================
# 📦 LOAD DATA
# =========================
echo "[LOG] Loading message file: $mode_message.json" >&2
data=$(cat .github/messages/"$mode_message".json)


# =========================
# 🎭 SELECT RANDOM TONE
# =========================
echo "[LOG] Selecting tone for mode: $mode" >&2
tone=$(echo "$data" | jq -r --arg mode "$mode" '
  .[$mode] | keys[]' | shuf -n 1)

echo "[LOG] Selected tone: $tone" >&2


# =========================
# 👋 SELECT GREETING
# =========================
greeting=$(echo "$data" | jq -r \
  --arg mode "$mode" \
  --arg tone "$tone" '
  .[$mode][$tone].greetings[]' | shuf -n 1)

echo "[LOG] Selected greeting: $greeting" >&2


# =========================
# 💬 SELECT MESSAGE
# =========================
message=$(echo "$data" | jq -r \
  --arg mode "$mode" \
  --arg tone "$tone" '
  .[$mode][$tone].messages[]' | shuf -n 1)

echo "[LOG] Selected message: $message" >&2


# =========================
# ✅ VALIDATION
# =========================
if [ -z "$tone" ] || [ -z "$greeting" ] || [ -z "$message" ]; then
  echo "[ERROR] No message found → exit" >&2
  exit 1
fi


# =========================
# 🎲 OUTPUT MODE (GACHA)
# =========================
gacha=$((RANDOM % 2))
echo "[LOG] Gacha result: $gacha" >&2

if [ "$gacha" -eq 0 ]; then
  echo "[LOG] Output mode: combined" >&2
  echo "TYPE=combined"
  echo "TEXT=$greeting $message"
else
  echo "[LOG] Output mode: split" >&2
  echo "TYPE=split"
  echo "GREETING=$greeting"
  echo "MESSAGE=$message"
fi