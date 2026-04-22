#!/bin/bash

# ==========================================
# 💜 Daily Report Script
# ------------------------------------------
# Fungsi:
# Mengambil aktivitas commit GitHub hari ini
# lalu mengirimkan laporan ke Telegram
#
# Input (ENV):
# GITHUB_USERNAME   → username GitHub
# TELEGRAM_TOKEN    → token bot
# TELEGRAM_CHANNEL_ID → chat/channel ID
#
# Output:
# Message laporan harian ke Telegram
#
# Flow:
# 1. Ambil event GitHub
# 2. Filter commit hari ini
# 3. Hitung total commit & repo
# 4. Ambil waktu pertama & terakhir
# 5. Generate message (dynamic tone)
# 6. Kirim ke Telegram sender
# ==========================================

#!/bin/bash

# =========================
# 🔗 CONFIG & DATE
# =========================
USERNAME="$GITHUB_USERNAME"

# Pakai LOCAL TIME (bukan UTC)
TODAY=$(date +"%Y-%m-%d")
YESTERDAY=$(date -d "yesterday" +"%Y-%m-%d")

echo "[LOG] User        : $USERNAME"
echo "[LOG] Today       : $TODAY"
echo "[LOG] Yesterday   : $YESTERDAY"


# =========================
# 🌐 FETCH GITHUB EVENTS
# =========================
echo "[LOG] Fetching GitHub events..."
events=$(curl -s "https://api.github.com/users/$USERNAME/events")

echo "[LOG] Sample events (first 3):"
echo "$events" | jq '.[0:3]'


# =========================
# 🔍 FILTER PUSH EVENT
# =========================
echo "[LOG] Filtering PushEvent for today & yesterday..."

today_events=$(echo "$events" | jq --arg today "$TODAY" --arg yesterday "$YESTERDAY" '
  [.[] | select(.type=="PushEvent" and 
    ((.created_at | startswith($today)) or (.created_at | startswith($yesterday)))
  )]
')

echo "[LOG] Filtered events:"
echo "$today_events" | jq '.'


# =========================
# 📊 CALCULATE DATA
# =========================

commit_count=$(echo "$today_events" | jq '[.[].payload.commits | length] | add // 0')

repos=$(echo "$today_events" | jq -r '[.[].repo.name] | unique | join(", ")')

echo "[LOG] Commit count : $commit_count"
echo "[LOG] Repos        : $repos"


# =========================
# ⏱️ TIME ANALYSIS
# =========================

first_time=$(echo "$today_events" | jq -r '.[0].created_at // empty' | cut -d'T' -f2 | cut -c1-5)
last_time=$(echo "$today_events" | jq -r '.[-1].created_at // empty' | cut -d'T' -f2 | cut -c1-5)

echo "[LOG] First commit : $first_time"
echo "[LOG] Last commit  : $last_time"


# =========================
# 🛡️ FALLBACK
# =========================
[ -z "$repos" ] && repos="-"
[ -z "$first_time" ] && first_time="-"
[ -z "$last_time" ] && last_time="-"


# =========================
# 🧠 MESSAGE GENERATOR
# =========================
if [ "$commit_count" -eq 0 ]; then

  message="📊 Daily Report — Hari Ini

commit: 0

hari ini kosong…

tapi kamu masih punya besok 😌"

elif [ "$commit_count" -le 2 ]; then

  message="📊 Daily Report — Hari Ini

commit: $commit_count
repo: $repos

gak banyak…
tapi kamu tetap gak nol hari ini 😏"

else

  message="📊 Daily Report — Hari Ini

commit: $commit_count
repo: $repos
first move: $first_time
last move: $last_time

kamu mulai pelan…
tapi kamu nutup hari ini dengan progress 😌"

fi


# =========================
# 📤 TELEGRAM SETUP
# =========================
export TYPE="combined"
export TEXT="$message"


# =========================
# 🚀 SEND MESSAGE
# =========================
echo "[LOG] Sending report to Telegram..."
bash .github/scripts/send.telegram.sh

echo "[LOG] DONE ✅"