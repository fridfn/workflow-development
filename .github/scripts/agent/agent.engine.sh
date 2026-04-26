#!/bin/bash

# ==========================================
# 💜 BOT ENGINE CORE (DYNAMIC COMPOSER)
# ------------------------------------------
# Version : 4.1 (Trace Enhanced)
# ==========================================
#
# Features:
# - Dynamic message composition (JSON driven)
# - Flexible: greeting / message / reaction
# - Tag-based behavior
# - Runtime override (COMPOSE_MODE)
# - Parallel sending
# - Full debug logging
#
# ==========================================


CONFIG=".github/scripts/agent/agent.config.json"

# =========================
# 🔹 INPUT
# =========================
MODE="${1:-$MODE}"
TAG="${2:-$TAG}"
COMPOSE_OVERRIDE="${COMPOSE_MODE:-}"

# =========================
# 🔹 LOG SYSTEM
# =========================
log() {
  local level="$1"
  local msg="$2"
  echo "[$level][ENGINE] $msg" >&2
}

log_info()  { log "INFO" "$1"; }
log_warn()  { log "WARN" "$1"; }
log_error() { log "ERROR" "$1"; }
log_debug() { log "DEBUG" "$1"; }

# =========================
# 🔹 SEND FUNCTION
# =========================
send_message () {
  local bot="$1"
  local text="$2"

  log_debug "[$bot] Preparing request..."

  local response
  response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
    "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage" \
    -d chat_id="$TELEGRAM_CHANNEL_ID" \
    --data-urlencode "text=$text")

  if [ "$response" != "200" ]; then
    log_warn "[$bot] Telegram API HTTP $response"
  else
    log_info "[$bot] Message sent (HTTP 200)"
  fi
}

# =========================
# 🚀 START
# =========================
log_info "Engine started"
log_info "Config → $CONFIG"
log_info "MODE → ${MODE:-<empty>}"
log_info "TAG  → ${TAG:-<none>}"
log_info "COMPOSE_OVERRIDE → ${COMPOSE_OVERRIDE:-<none>}"

# =========================
# 🔹 VALIDATION
# =========================
if [ -z "$MODE" ]; then
  log_error "MODE is missing → exit"
  exit 1
fi

if [ ! -f "$CONFIG" ]; then
  log_error "Config file not found"
  exit 1
fi

log_info "Validation passed"

# =========================
# 🔹 RANDOM SEED
# =========================
SEED_GREET=$RANDOM
SEED_MSG=$RANDOM

log_debug "Seed greet → $SEED_GREET"
log_debug "Seed msg   → $SEED_MSG"

# =========================
# 🔹 LOAD BOTS
# =========================
bots=$(jq -r 'keys[]' "$CONFIG")

if [ -z "$bots" ]; then
  log_warn "No bots found → exit"
  exit 0
fi

log_info "Bots:"
for b in $bots; do
  log_info " - $b"
done

# =========================
# 🔁 LOOP
# =========================
for bot in $bots; do

  log_info "--------------------------------"
  log_info "Processing → $bot"

  delay=$(jq -r --arg bot "$bot" '.[$bot].delay // 0' "$CONFIG")
  log_debug "[$bot] Delay → ${delay}s"

  log_debug "[$bot] Generating reply..."

  reply=$(jq -r \
     --arg bot "$bot" \
     --arg mode "$MODE" \
     --arg tag "${TAG:-}" \
     --arg override "$COMPOSE_OVERRIDE" \
     --argjson sg "$SEED_GREET" \
     --argjson sm "$SEED_MSG" \
   '
   .[$bot] as $cfg
   | $cfg.message as $root
   
   # =========================
   # 🔹 COMPOSE RULE
   # =========================
   | ($override
       | if . != "" then split(",") else empty end
     ) as $overrideCompose
   
   | ($overrideCompose
       // $cfg.compose[$tag]
       // $cfg.compose.default
       // ["greeting","message"]
     ) as $compose
   
   | trace("Compose → " + ($compose|tostring)) | .
   
   # =========================
   # 🔹 SELECT CATEGORY
   # =========================
   | ($root | to_entries | map(select(.value[$mode])) | .[0]) as $category
   
   | trace("Category → " + ($category.key // "null")) | .
   
   | if $category == null then empty else
   
       ($category.value[$mode]) as $group
       | ($group | keys) as $toneKeys
   
       | trace("ToneKeys → " + ($toneKeys|tostring)) | .
   
       | if ($toneKeys | length) == 0 then empty else
   
           ($sg % ($toneKeys | length)) as $toneIndex
           | $toneKeys[$toneIndex] as $tone
   
           | trace("Tone index → " + ($toneIndex|tostring)) | .
           | trace("Tone → " + $tone) | .
           | trace("Path → message." + $category.key + "." + $mode + "." + $tone) | .
   
           | ($group[$tone]) as $data
   
           # =========================
           # 🔹 PICK DATA
           # =========================
           | ($data.greetings[$sg % ($data.greetings | length)]) as $greet
           | ($data.messages[$sm % ($data.messages | length)]) as $msg
   
           | trace("Greeting picked") | .
           | trace("Message picked") | .
   
           | (
               if ($tag != "" and $root.reaction[$tag][$mode] != null) then
                 ($sm % ($root.reaction[$tag][$mode] | length)) as $reactIndex
                 | trace("Reaction index → " + ($reactIndex|tostring)) | .
                 | $root.reaction[$tag][$mode][$reactIndex]
               else null
               end
             ) as $react
   
           # =========================
           # 🔥 COMPOSER
           # =========================
           | [
               if ($compose | index("greeting")) then $greet else empty end,
               if ($compose | index("message")) then $msg else empty end,
               if ($compose | index("reaction") and $react != null) then $react else empty end
             ]
           | map(select(. != null and . != ""))
           | join("\n\n")
   
       end
     end
   ' "$CONFIG")

  # =========================
  # 🔍 TRACE LOG OUTPUT
  # =========================
  echo "$result" | jq -r 'select(.trace) | .trace' | while read -r line; do
    log_debug "[$bot][TRACE] $line"
  done

  reply=$(echo "$result" | jq -r 'select(.reply) | .reply')

  # =========================
  # 🔍 VALIDATION
  # =========================
  if [ -z "$reply" ] || [ "$reply" = "null" ]; then
    log_warn "[$bot] Empty reply → skip"
    continue
  fi

  log_debug "[$bot] Reply:"
  log_debug "--------------------"
  log_debug "$reply"
  log_debug "--------------------"

  # =========================
  # 📤 SEND
  # =========================
  log_info "[$bot] Schedule send in ${delay}s"

  (
    sleep "$delay"
    log_info "[$bot] Sending..."
    send_message "$bot" "$reply"
  ) &

done

# =========================
# ⏳ WAIT
# =========================
log_info "Waiting all bots..."
wait

# =========================
# ✅ DONE
# =========================
log_info "All bots done 💜"