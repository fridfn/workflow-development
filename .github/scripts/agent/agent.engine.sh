#!/bin/bash

# ==========================================
# 💜 Bot Engine Core
# ------------------------------------------
# Fungsi:
# Engine utama untuk generate & kirim pesan
# berdasarkan MODE + optional TAG
#
# Input (ENV):
# MODE  → ambitious / productive / warning dll
# TAG   → feat / fix / docs dll (optional)
#
# Output:
# Kirim pesan dari bot config
#
# Flow:
# 1. Load config JSON
# 2. Loop semua bot
# 3. Cari message sesuai MODE
# 4. Optional: inject TAG context
# 5. Random greeting + message
# 6. Delay per bot
# 7. Kirim ke Telegram
# ==========================================

CONFIG=".github/scripts/agent/agent.config.json"

send_message () {
  curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage" \
    -d chat_id="$TELEGRAM_CHANNEL_ID" \
    --data-urlencode "text=$1"
}

# Validasi Dasar
if [ -z "$MODE" ] || [ ! -f "$CONFIG" ]; then
  echo "[ERROR] MODE or Config missing" >&2
  exit 1
fi

# Menggunakan seed random yang lebih kuat untuk variasi
SEED_GREET=$RANDOM
SEED_MSG=$RANDOM

bots=$(jq -r 'keys[]' "$CONFIG")

for bot in $bots; do
  # Ambil delay dengan fallback 0
  delay=$(jq -r --arg bot "$bot" '.[$bot].delay // 0' "$CONFIG")

  # Logika pengambilan pesan disesuaikan dengan struktur agent.config.json
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
        | $toneKeys[$sg % ($toneKeys | length)] as $tone
        | ($group[$tone]) as $data
        | ($data.greetings[$sg % ($data.greetings | length)]) as $greet
        | ($data.messages[$sm % ($data.messages | length)]) as $msg
        | if ($tag != "" and $root.reaction[$tag][$mode] != null) then
            ($root.reaction[$tag][$mode]) as $tagData
            | $greet + "\n\n" + $msg + "\n\n" + $tagData[$sm % ($tagData | length)]
          else
            $greet + "\n\n" + $msg
          end
      end
    ' "$CONFIG")

  if [ -n "$reply" ] && [ "$reply" != "null" ]; then
    echo "[BOT] $bot sending in ${delay}s"
    ( sleep "$delay"; send_message "$reply" ) &
  fi
done

wait
echo "[BOT] DONE 💜"