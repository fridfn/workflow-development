#!/bin/bash

# ==========================================
# 💜 Bot Runner (Engine Entry Point)
# ==========================================

echo "=============================="
echo "🚀 BOT RUNNER START"
echo "=============================="

# =========================
# 🎲 COMPOSE WEIGHTS (NEW FEATURE)
# =========================
echo "=============================="
echo "🎲 COMPOSE WEIGHTS SETUP"
echo "=============================="

# Ambil dari ENV (workflow)
COMPOSE_WEIGHTS_INPUT="${COMPOSE_WEIGHTS:-}"

if [ -z "$COMPOSE_WEIGHTS_INPUT" ]; then
  echo "[WARN] COMPOSE_WEIGHTS not found in ENV"

  # fallback aman (biar gak crash)
  COMPOSE_WEIGHTS_INPUT='{"default":100}'

  echo "[FALLBACK] Using default weights → $COMPOSE_WEIGHTS_INPUT"
else
  echo "[OK] COMPOSE_WEIGHTS from ENV → $COMPOSE_WEIGHTS_INPUT"
fi

# export biar bisa dipake downstream
export COMPOSE_WEIGHTS="$COMPOSE_WEIGHTS_INPUT"

echo "[ENV] COMPOSE_WEIGHTS=$COMPOSE_WEIGHTS"

# =========================
# 📥 INPUT
# =========================
MODE_INPUT="$1"
TAG_INPUT="$2"
TYPE_INPUT="$3"

echo "[INPUT] MODE=$MODE_INPUT"
echo "[INPUT] TAG=$TAG_INPUT"
echo "[INPUT] TYPE=$TYPE_INPUT"

# =========================
# 🧠 VALIDATION + FALLBACK
# =========================
MODE="${MODE_INPUT:-}"
TAG="${TAG_INPUT:-}"
TYPE="${TYPE_INPUT:-}"

# =========================
# 🌍 EXPORT ENV
# =========================
export MODE
export TAG
export TYPE

echo "[ENV] MODE=$MODE"
echo "[ENV] TAG=$TAG"
echo "[ENV] TYPE=$TYPE"

# =========================
# ⏱️ CONTEXT (optional tapi penting)
# =========================
export CURRENT_HOUR=$(date +%H)
echo "[ENV] HOUR=$CURRENT_HOUR"

# =========================
# ⚙️ RUN ENGINE
# =========================
echo "=============================="
echo "🤖 ENGINE START"
echo "=============================="

bash .github/scripts/agent/agent.engine.sh "$MODE" "$TAG" "$TYPE"

echo "=============================="
echo "✅ ENGINE DONE"
echo "=============================="