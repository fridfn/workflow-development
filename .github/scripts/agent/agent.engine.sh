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

source ".github/scripts/lib/weighted.delay.sh"
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
  local agent="$1"
  local text="$2"

  log_debug "[$agent] Sending request..."

  local response
  response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
    "https://api.telegram.org/agent$TELEGRAM_TOKEN/sendMessage" \
    -d chat_id="$TELEGRAM_CHANNEL_ID" \
    --data-urlencode "text=$text")

  if [ "$response" != "200" ]; then
    log_warn "[$agent] Telegram API HTTP $response"
  else
    log_info "[$agent] Message sent ✔"
  fi
}

# =========================
# 🚀 START
# =========================
log_info "Engine started"
log_info "MODE → ${MODE:-<empty>}"
log_info "TAG  → ${TAG:-<none>}"
log_info "OVERRIDE → ${COMPOSE_OVERRIDE:-<none>}"

# =========================
# 🔹 VALIDATION
# =========================
if [ -z "$MODE" ]; then
  log_error "MODE is missing"
  exit 1
fi

if [ ! -f "$CONFIG" ]; then
  log_error "Config not found"
  exit 1
fi

# =========================
# 🔹 RANDOM SEED
# =========================
SEED_GREET=$RANDOM
SEED_MSG=$RANDOM

# =========================
# 🔹 LOAD BOTS
# =========================
agents=$(jq -r 'keys[]' "$CONFIG")

[ -z "$agents" ] && exit 0

# =========================
# 🔁 LOOP
# =========================
for agent in $agents; do

  start_time=$(date +%s)

  log_info "================================"
  log_info "[BOT] $agent → START"

  # =========================
  # 🔹 LOAD CONFIG
  # =========================
  delay=$(jq -r --arg agent "$agent" '.[$agent].delay // 0' "$CONFIG")
  
  RANDOM_DELAY=$(weighted_delay "$agent" 20 "$delay")
  
  log_debug "[$agent] Config delay → $delay"
  log_debug "[$agent] Active delay → $RANDOM_DELAY"
  
  # =========================
  # 🔹 PARSE ENGINE
  # =========================
  log_info "[$agent][STEP] Parsing engine..."

  result=$(jq -c \
    --arg agent "$agent" \
    --arg mode "$MODE" \
    --arg tag "${TAG:-}" \
    --arg override "$COMPOSE_OVERRIDE" \
    --argjson sg "$SEED_GREET" \
    --argjson sm "$SEED_MSG" \
  '
  .[$agent] as $cfg
  | $cfg.message as $root

  # COMPOSE
  | (
      if $override != "" then
        ($override | split(","))
      else
        ($cfg.compose[$tag] // $cfg.compose.default // ["greeting","message"])
      end
    ) as $compose

  # CATEGORY
  | ($root | to_entries | map(select(.value[$mode])) | .[0]) as $category

  | if $category == null then
      {reply:null, trace:["No category"]}
    else

      ($category.value[$mode]) as $group
      | ($group | keys) as $tones

      | if ($tones|length)==0 then
          {reply:null, trace:["No tones"]}
        else

          ($sg % ($tones|length)) as $ti
          | $tones[$ti] as $tone
          | ($group[$tone]) as $data

          | ($data.greetings[$sg % ($data.greetings|length)]) as $g
          | ($data.messages[$sm % ($data.messages|length)]) as $m

          | (
              if ($tag != "" and $root.reaction[$tag][$mode] != null)
              then $root.reaction[$tag][$mode][$sm % ($root.reaction[$tag][$mode]|length)]
              else null
              end
            ) as $r

          | [
              if ($compose | index("greeting")) then $g else empty end,
              if ($compose | index("message")) then $m else empty end,
              if ($compose | index("reaction") and $r != null) then $r else empty end
            ]
          | map(select(. != null and . != ""))
          | join("\n\n") as $final

          | {
              reply: $final,
              debug: {
                compose: $compose,
                category: $category.key,
                total_tones: ($tones|length),
                picked_tone_index: $ti,
                picked_tone: $tone,
                seed_greet: $sg,
                seed_msg: $sm
              }
            }

        end
    end
  ' "$CONFIG")

  # =========================
  # 🔍 DEBUG BREAKDOWN
  # =========================
  debug=$(echo "$result" | jq -c '.debug')

  log_info "[$agent][STEP] Debug breakdown:"
  echo "$debug" | jq -r '
    "  • Compose        : " + (.compose|tostring),
    "  • Category       : " + .category,
    "  • Total tones    : " + (.total_tones|tostring),
    "  • Tone index     : " + (.picked_tone_index|tostring),
    "  • Tone selected  : " + .picked_tone,
    "  • Seed greet     : " + (.seed_greet|tostring),
    "  • Seed msg       : " + (.seed_msg|tostring)
  ' | while read -r line; do
    log_debug "[$agent] $line"
  done

  reply=$(echo "$result" | jq -r '.reply')

  # =========================
  # 🔍 VALIDATION
  # =========================
  if [ -z "$reply" ] || [ "$reply" = "null" ]; then
    log_warn "[$agent][STEP] Reply empty → skip"
    continue
  fi

  log_info "[$agent][STEP] Reply generated ✔"

  log_debug "[$agent][OUTPUT]"
  log_debug "--------------------"
  log_debug "$reply"
  log_debug "--------------------"

  # =========================
  # 📤 SEND
  # =========================
  log_info "[$agent][STEP] Schedule send (${RANDOM_DELAY}s)"

  (
    sleep "$RANDOM_DELAY"
    log_info "[$agent][STEP] Sending..."
    send_message "$agent" "$reply"
  ) &

  # =========================
  # ⏱️ TIME TRACK
  # =========================
  end_time=$(date +%s)
  duration=$((end_time - start_time))
  log_info "[$agent][DONE] Completed in ${duration}s"

done

wait
log_info "All agents done 💜"