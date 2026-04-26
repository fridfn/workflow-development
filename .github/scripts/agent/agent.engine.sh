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

  log_debug "[$bot] Sending request..."

  local response
  response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \
    "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage" \
    -d chat_id="$TELEGRAM_CHANNEL_ID" \
    --data-urlencode "text=$text")

  if [ "$response" != "200" ]; then
    log_warn "[$bot] Telegram API HTTP $response"
  else
    log_info "[$bot] Message sent ✔"
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
bots=$(jq -r 'keys[]' "$CONFIG")

[ -z "$bots" ] && exit 0

# =========================
# 🔁 LOOP
# =========================
for bot in $bots; do

  log_info "Processing → $bot"

  delay=$(jq -r --arg bot "$bot" '.[$bot].delay // 0' "$CONFIG")

  result=$(jq -c \
    --arg bot "$bot" \
    --arg mode "$MODE" \
    --arg tag "${TAG:-}" \
    --arg override "$COMPOSE_OVERRIDE" \
    --argjson sg "$SEED_GREET" \
    --argjson sm "$SEED_MSG" \
  '
  def trace($msg): {"trace": $msg};

  .[$bot] as $cfg
  | $cfg.message as $root

  # =========================
  # 🔹 COMPOSE
  # =========================
  | (
      if $override != "" then
        ($override | split(","))
      else
        ($cfg.compose[$tag] // $cfg.compose.default // ["greeting","message"])
      end
    ) as $compose

  # =========================
  # 🔹 CATEGORY
  # =========================
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
              trace: [
                "Compose=" + ($compose|tostring),
                "Category=" + $category.key,
                "Tone=" + $tone
              ]
            }

        end
    end
  ' "$CONFIG")

  # =========================
  # 🔍 TRACE
  # =========================
  echo "$result" | jq -r '.trace[]?' | while read -r t; do
    log_debug "[$bot] $t"
  done

  reply=$(echo "$result" | jq -r '.reply')

  # =========================
  # 🔍 VALIDATION
  # =========================
  if [ -z "$reply" ] || [ "$reply" = "null" ]; then
    log_warn "[$bot] Empty reply"
    continue
  fi

  log_debug "[$bot] Reply:"
  log_debug "$reply"

  # =========================
  # 📤 SEND
  # =========================
  (
    sleep "$delay"
    send_message "$bot" "$reply"
  ) &

done

wait
log_info "All bots done 💜"