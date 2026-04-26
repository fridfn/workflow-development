#!/bin/bash

# ==========================================
# 💜 TIME HELPER ENGINE (WITH LOG TRACE)
# ------------------------------------------
# Purpose:
# - Determine bot mode based on time (Jakarta)
# - Provide commit / no-commit behavioral mode
# - Debug-friendly with step-by-step logs
#
# Modes:
#   commit-based      → ambitious / productive / persistent / consistent
#   no-commit-based   → warning / last_warning / final_warning
#
# ==========================================


# =========================
# 🔹 LOG SYSTEM
# =========================
log() {
  local level="$1"
  local msg="$2"
  echo "[$level][TIME] $msg" >&2
}

log_info()  { log "INFO" "$1"; }
log_warn()  { log "WARN" "$1"; }
log_debug() { log "DEBUG" "$1"; }


# =========================
# 💜 MODE: COMMIT BASED
# =========================
get_mode_by_commit() {

  log_info "Starting commit-based mode detection..."

  export TZ=Asia/Jakarta  
  local hour=$(date +%H)

  log_debug "Current hour (ID timezone): $hour"

  local mode=""

  if [ "$hour" -ge 12 ] && [ "$hour" -lt 16 ]; then
    mode="ambitious"
    log_debug "Matched: 12–16 → ambitious"

  elif [ "$hour" -ge 16 ] && [ "$hour" -lt 18 ]; then
    mode="productive"
    log_debug "Matched: 16–18 → productive"

  elif [ "$hour" -ge 18 ] && [ "$hour" -lt 21 ]; then
    mode="persistent"
    log_debug "Matched: 18–21 → persistent"

  elif [ "$hour" -ge 21 ] || [ "$hour" -lt 7 ]; then
    mode="consistent"
    log_debug "Matched: 21–07 → consistent"

  else
    log_warn "No matching time range found"
  fi


  # =========================
  # 🔹 VALIDATION
  # =========================
  if [ -z "$mode" ]; then
    log_warn "Mode detection failed"
    echo "No mode detected" >&2
    return 0
  fi

  log_info "Selected mode → $mode"

  echo "$mode"
}


# =========================
# 🌙 MODE: NO COMMIT BASED
# =========================
get_mode_by_no_commit() {

  log_info "Starting no-commit mode detection..."

  export TZ=Asia/Jakarta  
  local hour=$(date +%H)

  log_debug "Current hour (ID timezone): $hour"

  local mode=""
  local send=false

  if [ "$hour" -ge 12 ] && [ "$hour" -lt 19 ]; then

    log_debug "Phase: afternoon window (12–19)"
    [ $((RANDOM % 4)) -eq 0 ] && send=true

    mode="warning"
    log_info "Selected mode → warning"

  elif [ "$hour" -ge 19 ] && [ "$hour" -lt 23 ]; then

    log_debug "Phase: evening window (19–23)"
    [ $((RANDOM % 3)) -eq 0 ] && send=true

    mode="last_warning"
    log_info "Selected mode → last_warning"

  elif [ "$hour" -ge 23 ] || [ "$hour" -lt 7 ]; then

    log_debug "Phase: late night window (23–07)"
    [ $((RANDOM % 2)) -eq 0 ] && send=true

    mode="final_warning"
    log_info "Selected mode → final_warning"
  fi


  # =========================
  # 🔹 SKIP LOGIC
  # =========================
  if [ "$hour" -lt 12 ]; then
    log_info "Skip phase active (before 12:00)"
    echo "⏭️ Skip (smart interval)"
    echo "skip=true" >> $GITHUB_ENV
    return 0
  fi


  # =========================
  # 🔹 FINAL OUTPUT
  # =========================
  if [ -z "$mode" ]; then
    log_warn "No mode selected"
  else
    log_info "Final output mode → $mode"
  fi

  echo "$mode"
}