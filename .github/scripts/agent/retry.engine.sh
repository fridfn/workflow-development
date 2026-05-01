#!/bin/bash

source ".github/scripts/agent/lib/memory.sh"

agent="aurielle_nara_elowen"
MAX_RETRY=5

log_engine() {
  echo "[ENGINE] $1"
}

generate_message() {
  log_engine "[GEN] Calling agent.engine..."

  raw=$(bash .github/scripts/agent/agent.engine.sh)

  log_engine "[GEN] Raw output captured"

  # ambil JSON terakhir
  json=$(echo "$raw" | grep -o '{.*}' | tail -n 1)

  if [ -z "$json" ]; then
    log_engine "[GEN][ERROR] No JSON found"
    echo '{"reply":"hmm… aku kehilangan kata-kata tadi"}'
    return
  fi

  if ! echo "$json" | jq empty >/dev/null 2>&1; then
    log_engine "[GEN][ERROR] Invalid JSON"
    echo '{"reply":"kayaknya ada yang keputus di tengah jalan"}'
    return
  fi

  log_engine "[GEN] JSON OK ✔"
  echo "$json"
}

log_engine "START RETRY ENGINE"

attempt=1
found=false
used_replies=()

while [ $attempt -le $MAX_RETRY ]; do
  log_engine "=============================="
  log_engine "TRY $attempt / $MAX_RETRY"

  result=$(generate_message)
  reply=$(echo "$result" | jq -r '.reply')

  log_engine "Generated:"
  echo "$reply"

  last=$(get_memory "$agent.last_message")

  log_engine "Last message → ${last:-<none>}"

  # check same-loop duplicate
  for used in "${used_replies[@]}"; do
    if [ "$reply" == "$used" ]; then
      log_engine "Duplicate in same loop ❌"
      ((attempt++))
      continue 2
    fi
  done

  used_replies+=("$reply")

  # check history
  if is_in_history "$agent.history" "$reply"; then
    log_engine "Duplicate in history ❌"
    ((attempt++))
    continue
  fi

  # check last message
  if [ "$reply" == "$last" ] && [ -n "$last" ]; then
    log_engine "Same as last message ❌"
    ((attempt++))
    continue
  fi

  log_engine "✅ UNIQUE FOUND"
  found=true
  break
done

if [ "$found" = false ]; then
  log_engine "⚠️ FALLBACK USED"
  reply="hmm… aku nyoba cari cara lain buat ngomong ke kamu hari ini 💜"
fi

log_engine "=============================="
log_engine "FINAL MESSAGE:"
echo "$reply"

log_engine "SENDING TO TELEGRAM..."

curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage" \
  -d chat_id="$TELEGRAM_CHANNEL_ID" \
  -d text="$reply"

log_engine "SENT ✔"

# save memory
set_memory "$agent.last_message" "$reply"
push_history "$agent.history" "$reply" 5

log_engine "MEMORY UPDATED ✔"
log_engine "ENGINE DONE 💜"