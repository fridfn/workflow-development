#!/bin/bash

# ==========================================
# 💜 Bot Runner
# ------------------------------------------
# Wrapper biar gampang dipanggil dari workflow
# ==========================================

echo "[RUN][INPUT] MODE=$1"
echo "[RUN][INPUT] TAG=$2"

export MODE="$1"
export TAG="$2"

echo "[RUN][ENV] MODE=$MODE"
echo "[RUN][ENV] TAG=$TAG"


bash .github/scripts/agent/agent.engine.sh