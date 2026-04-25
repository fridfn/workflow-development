#!/bin/bash

# ==========================================
# 💜 Bot Runner
# ------------------------------------------
# Wrapper biar gampang dipanggil dari workflow
# ==========================================

export MODE="$1"
export TAG="$2"

bash .github/scripts/agent/agent.engine.sh