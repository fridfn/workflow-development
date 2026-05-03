#!/bin/bash

source ".github/scripts/time_helper.sh"

log() {
  echo "[MODE][SELECTOR] $1"
}

if [ "$has_commit" = "true" ]; then
  log "Using COMMIT mode"
  MODE=$(get_mode_by_commit)
else
  log "Using NO-COMMIT mode"
  MODE=$(get_mode_by_no_commit)
fi

echo "MODE=$MODE" >> $GITHUB_ENV

log "Final MODE: $MODE"
# 
# name: 💜 Daily Agent
# 
# on:
#   schedule:
#     - cron: "0 * * * *" # tiap jam
#   workflow_dispatch:
# 
# jobs:
#   run-agent:
#     runs-on: ubuntu-latest
# 
#     steps:
#       - name: Checkout repo
#         uses: actions/checkout@v4
# 
#       - name: Setup Node
#         uses: actions/setup-node@v4
#         with:
#           node-version: 20
# 
#       - name: Check Commit
#         run: bash .github/scripts/check_commit.sh
# 
#       - name: Get Mode
#         run: bash .github/scripts/get_mode.sh
# 
#       - name: Run Node Agent
#         run: node core/engine.js
#         env:
#           MODE: ${{ env.MODE }}
#           TAG: proud