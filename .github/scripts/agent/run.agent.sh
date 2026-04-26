#!/bin/bash

# ==========================================
# 💜 Bot Runner (Engine Entry Point)
# ==========================================

echo "=============================="
echo "🚀 BOT RUNNER START"
echo "=============================="

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
MODE="${MODE_INPUT:-neutral}"
TAG="${TAG_INPUT:-general}"
TYPE="${TYPE_INPUT:-unknown}"

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

bash .github/scripts/agent/agent.engine.sh

echo "=============================="
echo "✅ ENGINE DONE"
echo "=============================="