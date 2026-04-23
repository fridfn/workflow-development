#!/bin/bash

# ==========================================
# 💜 Time Helper
# ==========================================

get_mode_by_commit() {
  export TZ=Asia/Jakarta  
  local hour=$(date +%H)
  local mode=""

  if [ "$hour" -ge 12 ] && [ "$hour" -lt 16 ]; then
    mode="ambitious"
  elif [ "$hour" -ge 16 ] && [ "$hour" -lt 18 ]; then
    mode="productive"
  elif [ "$hour" -ge 18 ] && [ "$hour" -lt 21 ]; then
    mode="persistent"
  elif [ "$hour" -ge 21 ] || [ "$hour" -lt 7 ]; then
    mode="consistent"
  fi

  # ❗ kalau kosong → jangan echo sampah
  if [ -z "$mode" ]; then
    echo "No mode detected" >&2
    return 1
  fi

  echo "$mode"
}

get_mode_by_no_commit() {
  export TZ=Asia/Jakarta  
  local hour=$(date +%H)

  echo "⏳ Hour: $hour" >&2

  local mode=""
  local send=false
  
  if [ "$hour" -ge 12 ] && [ "$hour" -lt 19 ]; then
    [ $((RANDOM % 4)) -eq 0 ] && send=true
    mode="warning" 
    echo "🌤️ Phase: Sore (low frequency)" >&2
    
  elif [ "$hour" -ge 19 ] && [ "$hour" -lt 23 ]; then
    [ $((RANDOM % 3)) -eq 0 ] && send=true
    mode="last_warning"  
    echo "🌙 Phase: Malam (medium)" >&2
    
  elif [ "$hour" -ge 23 ] || [ "$hour" -lt 7 ]; then
    [ $((RANDOM % 2)) -eq 0 ] && send=true
    mode="final_warning"  
    echo "🌌 Phase: Late (high)" >&2
  fi
  
  if [ "$hour" -lt 12 ]; then
    echo "⏭️ Skip (smart interval)"
    echo "skip=true" >> $GITHUB_ENV
    return 0
  fi

  echo "$mode"
}
