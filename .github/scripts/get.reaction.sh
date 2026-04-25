#!/bin/bash

# ==========================================
# 💜 Reaction Generator Script
# ------------------------------------------
# Input  : $type (commit type)  ← via ENV
#          $mode (time mode)    ← via ENV
#
# Output : reaction text (stdout)
#
# Flow:
# validate → select reaction → fallback → output
# ==========================================


# =========================
# 🔹 VALIDATION
# ✅ FIX: validasi $type dan $mode sebelum dipakai
# BUG LAMA: langsung dipakai tanpa cek → silent wrong behavior
# =========================
if [ -z "$type" ]; then
  echo "[ERROR] \$type not set" >&2
  exit 1
fi

if [ -z "$mode" ]; then
  echo "[ERROR] \$mode not set" >&2
  exit 1
fi


# =========================
# 📦 LOAD DATA
# =========================
REACTION_FILE=".github/messages/reaction.json"

if [ ! -f "$REACTION_FILE" ]; then
  echo "[ERROR] reaction.json not found: $REACTION_FILE" >&2
  exit 1
fi

echo "[LOG] Loading reaction.json" >&2


# =========================
# 🧠 INPUT INFO
# =========================
echo "[LOG] Input → type=$type | mode=$mode" >&2


# =========================
# 🎯 SELECT REACTION
# ✅ FIX: jq baca langsung dari file, tidak lewat cat+variable+echo
# BUG LAMA: echo "$data" bisa mangle escape sequences di JSON
# =========================
reaction=$(jq -r \
  --arg type "$type" \
  --arg mode "$mode" \
  '.[$type][$mode][]?' "$REACTION_FILE" | shuf -n 1)

echo "[LOG] Raw reaction: $reaction" >&2


# =========================
# ⚠️ FALLBACK SYSTEM
# Fallback berlapis biar gak pernah kosong
# =========================
if [ -z "$reaction" ] || [ "$reaction" = "null" ]; then
  echo "[LOG] Primary reaction empty → fallback: update" >&2

  reaction=$(jq -r \
    --arg mode "$mode" \
    '.update[$mode][]?' "$REACTION_FILE" | shuf -n 1)
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
echo "$reaction"