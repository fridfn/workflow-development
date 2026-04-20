#!/bin/bash

# ==========================================
# 💜 Reaction Generator Script
# ------------------------------------------
# Input  : $type (commit type)
#          $mode (time mode)
#
# Output : REACTION=text
#
# Flow:
# load json → select reaction → fallback
#           → validate → output
# ==========================================


# =========================
# 📦 LOAD DATA
# =========================
echo "[LOG] Loading reaction.json" >&2
data=$(cat .github/messages/reaction.json)


# =========================
# 🧠 INPUT INFO
# =========================
echo "[LOG] Input → type=$type | mode=$mode" >&2


# =========================
# 🎯 SELECT REACTION
# =========================
reaction=$(echo "$data" | jq -r \
  --arg type "$type" \
  --arg mode "$mode" \
  '.[$type][$mode][]?' | shuf -n 1)

echo "[LOG] Raw reaction: $reaction" >&2


# =========================
# ⚠️ FALLBACK SYSTEM
# =========================
# Fallback berlapis biar gak pernah kosong

if [ -z "$reaction" ] || [ "$reaction" = "null" ]; then
  echo "[LOG] Primary reaction empty → fallback: update" >&2
  
  reaction=$(echo "$data" | jq -r \
    --arg mode "$mode" \
    '.update[$mode][]?' | shuf -n 1)
fi

if [ -z "$reaction" ] || [ "$reaction" = "null" ]; then
  echo "[LOG] Secondary fallback → default message" >&2
  reaction="kamu tetap jalan hari ini… itu udah cukup"
fi


# =========================
# ✅ FINAL VALIDATION
# =========================
if [ -z "$reaction" ]; then
  echo "[ERROR] Reaction still empty → exit" >&2
  exit 1
fi


# =========================
# 📤 OUTPUT
# =========================
echo "[LOG] Final reaction ready" >&2
echo "REACTION=$reaction"