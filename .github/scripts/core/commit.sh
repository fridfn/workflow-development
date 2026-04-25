#!/bin/bash

# ==========================================
# 💜 Commit Parser Core
# ------------------------------------------
# Input  :
#   COMMIT_MESSAGE
#
# Output :
#   type
#   detail
#   reaction
#
# Usage:
#   source parse.commit.sh
#   parse_commit "$msg"
# ==========================================

parse_commit() {
  local msg="$1"

  # =========================
  # 🔹 PARSE TYPE & DETAIL
  # =========================
  if [[ "$msg" == *":"* ]]; then
    TYPE=$(echo "$msg" | head -n1 | cut -d':' -f1)
    DETAIL=$(echo "$msg" | tail -n +1 | cut -d':' -f2-)
  else
    TYPE="update"
    DETAIL="$msg"
  fi

  # =========================
  # 🔹 MAP REACTION
  # =========================
  case "$TYPE" in
    feat*) REACTION="feat" ;;
    fix*) REACTION="fix" ;;
    refactor*) REACTION="refactor" ;;
    chore*) REACTION="chore" ;;
    docs*) REACTION="docs" ;;
    style*) REACTION="style" ;;
    test*) REACTION="test" ;;
    *) REACTION="update" ;;
  esac

  # =========================
  # 🔹 EXPORT RESULT
  # =========================
  export TYPE
  export DETAIL
  export REACTION
}