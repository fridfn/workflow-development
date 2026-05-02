#!/bin/bash  
  
# ==========================================  
# 💜 BOT ENGINE CORE (DYNAMIC COMPOSER)  
# ------------------------------------------  
# Version : 4.1 (Trace Enhanced)  
# ==========================================  
  
source ".github/scripts/agent/retry.engine.sh"  
source ".github/scripts/agent/brain/memory.store.sh"  
source ".github/scripts/agent/lib/compose.weighted.sh"
source ".github/scripts/agent/lib/context.aware.sh"  
source ".github/scripts/lib/weighted.delay.sh"  

CONFIG=".github/scripts/agent/agent.config.json"  
  
# =========================  
# 🔹 INPUT  
# =========================  
MODE="${MODE:-}"  
TAG="${TAG:-}"  
COMPOSE_OVERRIDE="${COMPOSE_OVERRIDE:-$COMPOSE_MODE}"  
  
# =========================  
# 🔹 LOG SYSTEM (ENHANCED)  
# =========================  

get_time() {
  date +"%H:%M:%S"
}

log() {  
  local level="$1"  
  local msg="$2"  
  local time=$(get_time)
  echo "[$time][$level][ENGINE] $msg" >&2  
}  
  
log_info()  { log "INFO" "$1"; }  
log_warn()  { log "WARN" "$1"; }  
log_error() { log "ERROR" "$1"; }  
log_debug() { log "DEBUG" "$1"; }  

log_trace() {
  local msg="$1"
  local time=$(get_time)
  echo "[$time][TRACE][ENGINE] $msg" >&2
}

log_section() {
  local title="$1"
  local time=$(get_time)
  echo "" >&2
  echo "[$time][SECTION][ENGINE] =================================" >&2
  echo "[$time][SECTION][ENGINE] 🚀 $title" >&2
  echo "[$time][SECTION][ENGINE] =================================" >&2
}

# =========================  
# 🔹 SEND FUNCTION  
# =========================  
send_message () {  
  local agent="$1"  
  local text="$2"  
   
  log_debug "[$agent][SEND] Sending request..."  
  
  local response  
  response=$(curl -s -w "%{http_code}" -o /dev/null -X POST \  
    "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage" \  
    -d chat_id="$TELEGRAM_CHANNEL_ID" \  
    --data-urlencode "text=$text  
    ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ")  
      
  if [ "$response" != "200" ]; then  
    log_warn "[$agent][SEND] Telegram API HTTP $response"  
  else  
    log_info "[$agent][SEND] Message sent ✔"  
  fi  
}  
  
# =========================  
# 🚀 START  
# =========================  

log_section "ENGINE START"

log_info "[BOOT] Incoming arguments..."  
log_info "[BOOT] ENV MODE=$MODE"  
log_info "[BOOT] ENV TAG=$TAG"  
log_info "[BOOT] ENV TYPE=$TYPE"  
  
log_info "[BOOT] Engine started"  
log_info "[BOOT] MODE → ${MODE:-<empty>}"  
log_info "[BOOT] TAG  → ${TAG:-<none>}"  
log_info "[BOOT] OVERRIDE → ${COMPOSE_OVERRIDE:-<none>}"  
  
TIME_CTX=$(get_time_context)  
log_info "[CONTEXT] Time → $TIME_CTX"  
  
# =========================  
# 🎯 WEIGHTED COMPOSE  
# =========================  

log_section "WEIGHTED COMPOSE"

log_trace "Calling apply_weighted_compose"

apply_weighted_compose  
  
log_info "[COMPOSE] MODE → ${COMPOSE_MODE:-<none>}"  
  
# =========================  
# 🔹 VALIDATION  
# =========================  

log_section "VALIDATION"

if [ -z "$MODE" ]; then  
  log_error "[VALIDATION] MODE is missing"  
  exit 1  
fi  
  
if [ ! -f "$CONFIG" ]; then  
  log_error "[VALIDATION] Config not found"  
  exit 1  
fi  
  
# =========================  
# 🔹 RANDOM SEED  
# =========================  

log_section "SEED INIT"

SEED_GREET=$RANDOM  
SEED_MSG=$RANDOM  

log_debug "[SEED] GREET → $SEED_GREET"
log_debug "[SEED] MSG   → $SEED_MSG"
  
# =========================  
# 🔹 LOAD BOTS  
# =========================  

log_section "LOAD AGENTS"

agents=$(jq -r 'keys[]' "$CONFIG" 2>/dev/null)  
  
if [ -z "$agents" ]; then  
  log_error "[AGENT] NO AGENTS FOUND IN CONFIG"  
  exit 1  
fi  
  
log_info "[AGENT] Loaded agents:"  
for a in $agents; do  
  log_info "[AGENT] - $a"  
done  
  
# =========================  
# 🔁 LOOP  
# =========================  

for agent in $agents; do  
  
  start_time=$(date +%s)  
  
  log_section "AGENT → $agent START"
  
  # =========================  
  # 🔹 LOAD CONFIG  
  # =========================  
  
  delay=$(jq -r --arg agent "$agent" '.[$agent].delay // 0' "$CONFIG")  
    
  RANDOM_DELAY=$(weighted_delay "$agent" 20 "$delay")  
    
  log_debug "[$agent][DELAY] Config → $delay"  
  log_debug "[$agent][DELAY] Active → $RANDOM_DELAY"  
    
  # =========================  
  # 🔹 PARSE ENGINE  
  # =========================  
  
  log_info "[$agent][STEP] Parsing engine..."  
  
  generate_reply() {
    jq -c \
      --arg agent "$agent" \
      --arg mode "$MODE" \
      --arg tag "${TAG:-}" \
      --arg override "$COMPOSE_OVERRIDE" \
      --argjson sg "$SEED_GREET" \
      --argjson sm "$SEED_MSG" \
    '
    .[$agent] as $cfg
    | $cfg.message as $root
  
    | (
        if $override != "" then
          ($override | split(","))
        else
          ($cfg.compose[$tag] // $cfg.compose.default // ["greeting","message"])
        end
      ) as $compose
  
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
    ' "$CONFIG"
  }
    
  # =========================  
  # 🧠 INITIAL GENERATION  
  # =========================  
  
  log_info "[$agent][STEP] Initial generation..."  
    
  result=$(generate_reply)  
    
  log_debug "[$agent][RAW]"  
  echo "$result" | jq '.' | while read -r line; do  
    log_debug "[$agent] $line"  
  done  
    
  # =========================  
  # 🔍 DEBUG BREAKDOWN  
  # =========================  
  
  debug=$(echo "$result" | jq -c '.debug')  
  
  log_info "[$agent][DEBUG] Breakdown:"  
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
  # 🔁 ANTI REPEAT  
  # =========================  
  
  log_section "$agent → MEMORY CHECK"

  last=$(get_memory "$agent.last_message")  
    
  if [ "$reply" = "$last" ]; then  
    log_warn "[$agent][MEMORY] Duplicate detected → retry"  
      
    new=$(retry_generate "$agent" "$reply" generate_reply)  
    
    if [ $? -eq 0 ]; then  
      reply=$(echo "$new" | jq -r '.reply')  
      log_info "[$agent][MEMORY] Retry success ✔"  
    else  
      log_warn "[$agent][MEMORY] Retry failed"  
    fi  
  fi  
    
  # =========================  
  # 🔍 VALIDATION  
  # =========================  
  
  if [ -z "$reply" ] || [ "$reply" = "null" ]; then  
    log_warn "[$agent][VALIDATION] Reply empty → skip"  
    continue  
  fi  
    
  log_info "[$agent][ANTI-REPEAT] Checking history..."  
     
  if is_in_history "$agent.history" "$reply"; then  
    log_warn "[$agent][ANTI-REPEAT] Duplicate in history → skip"  
    continue  
  fi  
     
  log_info "[$agent][MEMORY] Saving..."  
     
  set_memory "$agent.last_message" "$reply"  
  push_history "$agent.history" "$reply" 5  
     
  log_info "[$agent][DONE] Reply generated ✔"  
    
  log_debug "[$agent][OUTPUT]"  
  log_debug "--------------------"  
  log_debug "$reply"  
  log_debug "--------------------"  
  
  # =========================  
  # 📤 SEND  
  # =========================  
  
  log_info "[$agent][SEND] Schedule (${RANDOM_DELAY}s)"  
  
  (  
    sleep "$RANDOM_DELAY"  
    log_info "[$agent][SEND] Sending..."  
    send_message "$agent" "$reply"  
  ) &  
  
  # =========================  
  # ⏱️ TIME TRACK  
  # =========================  
  
  end_time=$(date +%s)  
  duration=$((end_time - start_time))  
  log_info "[$agent][TIME] Completed in ${duration}s"  
  
done  
  
wait  

log_section "ENGINE DONE"
log_info "All agents done 💜"