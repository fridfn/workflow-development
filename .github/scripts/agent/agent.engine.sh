#!/bin/bash

# ==========================================
# 💜 BOT ENGINE CORE (WITH FULL LOGS)
# ------------------------------------------
# Version : 2.0 (Debug Enhanced)
# Mode    : Parallel Execution
#
# Features:
# - Structured logging per step
# - Safe debug jq pipeline
# - Delay tracking per bot
# - Output visibility (reply preview)
#
# ==========================================


CONFIG=".github/scripts/agent/agent.config.json"


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
# 🚀 START ENGINE
# =========================
log_info "Engine started"
log_info "Config file → $CONFIG"
log_info "MODE → ${MODE:-<empty>}"
log_info "TAG  → ${TAG:-<none>}"


# =========================
# 🔹 VALIDATION
# =========================
if [ -z "$MODE" ]; then
  log_error "MODE is missing → exit"
  exit 1
fi

if [ ! -f "$CONFIG" ]; then
  log_error "Config file not found → $CONFIG"
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
  log_warn "No bots found in config → exit"
  exit 0
fi

log_info "Bots detected:"
for b in $bots; do
  log_info " - $b"
done


# =========================
# 🔁 LOOP BOTS
# =========================
for bot in $bots; do

  log_info "------------------------------------------"
  log_info "Processing bot → $bot"

  # 🔹 Delay
  delay=$(jq -r --arg bot "$bot" '.[$bot].delay // 0' "$CONFIG")
  log_debug "[$bot] Delay → ${delay}s"


  # =========================
  # 🧠 GENERATE MESSAGE
  # =========================
  log_debug "[$bot] Generating reply..."

  reply=$(jq -r \
    --arg bot "$bot" \
    --arg mode "$MODE" \
    --arg tag "${TAG:-}" \
    --argjson sg "$SEED_GREET" \
    --argjson sm "$SEED_MSG" \
    '
    .[$bot].message as $root
    | ($root | to_entries | map(select(.value[$mode])) | .[0]) as $category
    | if $category == null then empty else
        ($category.value[$mode]) as $group
        | ($group | keys) as $toneKeys
        | if ($toneKeys | length) == 0 then empty else
            $toneKeys[$sg % ($toneKeys | length)] as $tone
            | ($group[$tone]) as $data
            | if ($data.greetings | length) == 0 or ($data.messages | length) == 0 then empty else
                ($data.greetings[$sg % ($data.greetings | length)]) as $greet
                | ($data.messages[$sm % ($data.messages | length)]) as $msg
                | if ($tag != "" and $root.reaction[$tag][$mode] != null) then
                    ($root.reaction[$tag][$mode]) as $tagData
                    | if ($tagData | length) == 0 then
                        $greet + "\n\n" + $msg
                      else
                        $greet + "\n\n" + $msg + "\n\n" + $tagData[$sm % ($tagData | length)]
                      end
                  else
                    $greet + "\n\n" + $msg
                  end
              end
          end
      end
    ' "$CONFIG")


  # =========================
  # 🔍 VALIDASI OUTPUT
  # =========================
  if [ -z "$reply" ] || [ "$reply" = "null" ]; then
    log_warn "[$bot] No valid reply generated → skip"
    continue
  fi

  log_debug "[$bot] Reply generated:"
  log_debug "--------------------------------"
  log_debug "$reply"
  log_debug "--------------------------------"


  # =========================
  # 📤 SEND (PARALLEL)
  # =========================
  log_info "[$bot] Scheduling send in ${delay}s"

  (
    sleep "$delay"
    log_info "[$bot] Sending now..."
    send_message "$bot" "$reply"
  ) &

done


# =========================
# ⏳ WAIT ALL
# =========================
log_info "Waiting all bots to finish..."
wait


# =========================
# ✅ DONE
# =========================
log_info "All bots completed 💜"