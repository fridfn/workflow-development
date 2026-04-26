# ==========================================
# 🎲 WEIGHTED DELAY ENGINE
# ==========================================

weighted_delay () {
  local agent="$1"
  local min_delay="$2"
  local max_delay="$3"

  log_debug "[$agent] Base MIN → $min_delay"
  log_debug "[$agent] Base MAX → $max_delay"

  local range=$((max_delay - min_delay))

  log_debug "[$agent] RANGE → $range"

  local roll=$((RANDOM % 100))

  log_debug "[$agent] ROLL → $roll"

  local result=0

  if [ "$roll" -lt 60 ]; then

    log_debug "[$agent] PATH → MID"

    local base=$(( min_delay + range / 2 ))
    local var=$(( range / 4 + 1 ))

    local offset=$(( RANDOM % var ))

    log_debug "[$agent] MID_BASE → $base"
    log_debug "[$agent] MID_OFFSET → $offset"

    result=$(( base + offset ))

  elif [ "$roll" -lt 80 ]; then

    log_debug "[$agent] PATH → FAST"

    local var=$(( range / 3 + 1 ))
    local offset=$(( RANDOM % var ))

    log_debug "[$agent] FAST_OFFSET → $offset"

    result=$(( min_delay + offset ))

  else

    log_debug "[$agent] PATH → SLOW"

    local var=$(( range / 3 + 1 ))
    local offset=$(( RANDOM % var ))

    log_debug "[$agent] SLOW_OFFSET → $offset"

    result=$(( max_delay - offset ))

  fi

  log_info "[$agent] FINAL WEIGHTED DELAY → ${result}s"

  echo "$result"
}