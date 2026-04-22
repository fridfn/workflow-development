#!/bin/bash

# ==========================================
# 💜 Time Helper
# ==========================================

get_mode_by_commit() {
  export TZ=Asia/Jakarta  
  hour=$(date +%H)

  if [ "$hour" -ge 12 ] && [ "$hour" -lt 16 ]; then
    echo "ambitious"
  elif [ "$hour" -ge 16 ] && [ "$hour" -lt 18 ]; then
    echo "productive"
  elif [ "$hour" -ge 18 ] && [ "$hour" -lt 21 ]; then
    echo "persistent"
  elif [ "$hour" -ge 21 ] || [ "$hour" -lt 7 ]; then
    echo "consistent"
  else
    echo ""
  fi

  if [ -z "$mode" ]; then
    echo "⏭️ No mode → exit"
    exit 0
  fi
}

get_mode_by_no_commit() {
  export TZ=Asia/Jakarta  
  hour=$(date +%H)

  echo "⏳ Hour: $hour"

  mode=""
  send=false
  
  if [ "$hour" -ge 14 ] && [ "$hour" -lt 19 ]; then
    [ $((RANDOM % 4)) -eq 0 ] && send=true
    mode="warning" 
    echo "🌤️ Phase: Sore (low frequency)"
    
  elif [ "$hour" -ge 19 ] && [ "$hour" -lt 23 ]; then
    [ $((RANDOM % 3)) -eq 0 ] && send=true
    mode="last_warning"  
    echo "🌙 Phase: Malam (medium)"
    
  elif [ "$hour" -ge 23 ] || [ "$hour" -lt 7 ]; then
    [ $((RANDOM % 2)) -eq 0 ] && send=true
    mode="final_warning"  
    echo "🌌 Phase: Late (high)"
  fi
  
  if [ "$send" = false ]; then
    echo "⏭️ Skip (smart interval)"
    exit 0
  fi
}