#!/bin/bash

# =========================
# 🎲 COMPOSE WEIGHTS (NEW FEATURE)
# =========================

get_time() {
  date +"%H:%M:%S"
}

log() {
  local level="$1"
  local msg="$2"
  local time=$(get_time)
  echo "[$time][$level][RUN] $msg"
}

log_info()  { log "INFO" "$1"; }
log_warn()  { log "WARN" "$1"; }
log_debug() { log "DEBUG" "$1"; }

log_section() {
  local title="$1"
  local time=$(get_time)
  echo ""
  echo "[$time][SECTION][RUN] =============================="
  echo "[$time][SECTION][RUN] 🚀 $title"
  echo "[$time][SECTION][RUN] =============================="
}

# =========================
# 🎲 COMPOSE WEIGHTS SETUP
# =========================

log_section "COMPOSE WEIGHTS SETUP"

# tetap tampilkan versi lama (biar backward readable)
echo "=============================="
echo "🎲 COMPOSE WEIGHTS SETUP"
echo "=============================="

ulimit -u 100
COMPOSE_WEIGHTS_INPUT="${COMPOSE_WEIGHTS:-}"

if [ -z "$COMPOSE_WEIGHTS_INPUT" ]; then
  log_warn "[COMPOSE] COMPOSE_WEIGHTS not found in ENV"

  COMPOSE_WEIGHTS_INPUT='{"default":100}'

  log_info "[COMPOSE] Using fallback → $COMPOSE_WEIGHTS_INPUT"

  echo "[WARN] COMPOSE_WEIGHTS not found in ENV"
  echo "[FALLBACK] Using default weights → $COMPOSE_WEIGHTS_INPUT"
else
  log_info "[COMPOSE] Loaded from ENV → $COMPOSE_WEIGHTS_INPUT"

  echo "[OK] COMPOSE_WEIGHTS from ENV → $COMPOSE_WEIGHTS_INPUT"
fi

export COMPOSE_WEIGHTS="$COMPOSE_WEIGHTS_INPUT"

log_debug "[ENV] COMPOSE_WEIGHTS=$COMPOSE_WEIGHTS"
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

log_section "ENV SETUP"

log_info "[ENV] MODE=$MODE"
log_info "[ENV] TAG=$TAG"
log_info "[ENV] TYPE=$TYPE"
log_info "[ENV] COMPOSE_WEIGHTS=$COMPOSE_WEIGHTS"

# =========================
# ⏱️ CONTEXT
# =========================

CURRENT_HOUR=$(date +%H)
export CURRENT_HOUR

log_info "[CONTEXT] Hour → $CURRENT_HOUR"
echo "[ENV] HOUR=$CURRENT_HOUR"

# =========================
# ⚙️ RUN ENGINE
# =========================

log_section "ENGINE START"

echo "=============================="
echo "🤖 ENGINE START"
echo "=============================="

log_info "[FLOW] Calling agent.engine.sh"

bash .github/scripts/agent/agent.engine.sh

# =========================
# 🏁 DONE
# =========================

log_section "ENGINE DONE"

echo "=============================="
echo "✅ ENGINE DONE"
echo "=============================="

log_info "[FLOW] Engine execution completed"