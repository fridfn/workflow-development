#!/bin/bash

# ==========================================
# 💜 Bot Runner
# ------------------------------------------
# Wrapper biar gampang dipanggil dari workflow
# ==========================================

export MODE="$1"
export TAG="$2"
export TYPE_CHAT="$3"

# ✅ FIX: Path diperbaiki dari core/ ke agent/
bash .github/scripts/agent/agent.engine.sh