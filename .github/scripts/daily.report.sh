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

set -e


# =========================
# 🔗 CONFIG & DATE
# =========================
USERNAME="$GITHUB_USERNAME"
TODAY=$(date -u +"%Y-%m-%d")

echo "[LOG] Generate daily report for $USERNAME ($TODAY)" >&2


# =========================
# 🌐 FETCH GITHUB EVENTS
# =========================
events=$(curl -s "https://api.github.com/users/$USERNAME/events")


# =========================
# 🔍 FILTER TODAY PUSH EVENT
# =========================
today_events=$(echo "$events" | jq --arg today "$TODAY" '
  [.[] | select(.type=="PushEvent" and (.created_at | startswith($today)))]
')


# =========================
# 📊 CALCULATE DATA
# =========================

# Total commit hari ini
commit_count=$(echo "$today_events" | jq '[.[].payload.commits | length] | add // 0')

# List repo unik
repos=$(echo "$today_events" | jq -r '[.[].repo.name] | unique | join(", ")')


# =========================
# ⏱️ TIME ANALYSIS
# =========================

# Waktu commit pertama
first_time=$(echo "$today_events" | jq -r '.[0].created_at // empty' | cut -d'T' -f2 | cut -c1-5)

# Waktu commit terakhir
last_time=$(echo "$today_events" | jq -r '.[-1].created_at // empty' | cut -d'T' -f2 | cut -c1-5)


# =========================
# 🛡️ FALLBACK HANDLING
# =========================
[ -z "$repos" ] && repos="-"
[ -z "$first_time" ] && first_time="-"
[ -z "$last_time" ] && last_time="-"


# =========================
# 🧠 MESSAGE GENERATOR
# =========================
# Mode:
# 0 commit  → empty
# 1–2 commit → low
# >2 commit → active

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
# 📤 TELEGRAM PAYLOAD SETUP
# =========================
# Mode: combined (1 message)
export TYPE="combined"
export TEXT="$message"


# =========================
# 🚀 SEND MESSAGE
# =========================
echo "[LOG] Sending report to Telegram..." >&2
bash .github/scripts/send.telegram.sh