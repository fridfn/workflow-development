#!/bin/bash

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
# 🧠 VALIDATION + FALLBACK
# =========================
MODE="${MODE:-}"
TAG="${TAG:-}"
TYPE="${TYPE:-}"

# =========================
# 🌍 EXPORT ENV
# =========================
export MODE
export TAG
export TYPE

echo "[ENV] MODE=$MODE"
echo "[ENV] TAG=$TAG"
echo "[ENV] TYPE=$TYPE"
echo "[ENV] COMPOSE_WEIGHTS=$COMPOSE_WEIGHTS"

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

bash .github/scripts/agent/agent.engine.sh

echo "=============================="
echo "✅ ENGINE DONE"
echo "=============================="