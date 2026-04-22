#!/bin/bash

# ==========================================
# 💜 GitHub Output Helper
# ------------------------------------------
# Fungsi:
# Set output GitHub Actions (support multiline)
#
# Usage:
# set_output "key" "value"
# ==========================================

set_output() {
  local key="$1"
  local value="$2"

  echo "$key=$value" >> "$GITHUB_OUTPUT"
}

set_multiline() {
  local key="$1"
  local value="$2"
  
  value=$(printf "%s" "$value" | sed 's/^-/•/g')
  
  echo "$key<<EOF" >> "$GITHUB_OUTPUT"
  echo "$value" >> "$GITHUB_OUTPUT"
  echo "EOF" >> "$GITHUB_OUTPUT"
}