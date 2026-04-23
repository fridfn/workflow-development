#!/bin/bash

# ==========================================
# 💜 Daily Report Script (Commit-Based)
# ------------------------------------------
# Fungsi:
# Mengambil data commit GitHub berdasarkan hari (UTC)
# menggunakan GitHub Search API, lalu mengirim laporan ke Telegram
#
# Input (ENV):
# GITHUB_USERNAME      → username GitHub
# GITHUB_TOKEN         → personal access token (required)
# TELEGRAM_TOKEN       → token bot Telegram
# TELEGRAM_CHANNEL_ID  → chat/channel ID
#
# Output:
# Message laporan harian ke Telegram
#
# Flow:
# 1. Set UTC date range
# 2. Fetch commit via Search API
# 3. Extract commit count & repo
# 4. Analyze first & last commit time
# 5. Generate dynamic message
# 6. Send to Telegram
#
# Notes:
# - Tidak tergantung Events API (no limit 30)
# - Lebih akurat & stabil
# - Semua waktu berbasis UTC
# ==========================================


# =========================
# 🔗 CONFIG & DATE (UTC)
# =========================
USERNAME="$GITHUB_USERNAME"

TODAY=$(date -u +"%Y-%m-%d")
START="${TODAY}T00:00:00Z"
END="${TODAY}T23:59:59Z"

echo "[LOG] User        : $USERNAME"
echo "[LOG] Date (UTC)  : $TODAY"
echo "[LOG] Range       : $START → $END"


# =========================
# 🌐 FETCH COMMITS (API)
# =========================
echo "[LOG] Fetching commits via GitHub Search API..."

response=$(curl -s \
  -H "Accept: application/vnd.github.cloak-preview" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/search/commits?q=author:$USERNAME+committer-date:$START..$END&per_page=100")

echo "[LOG] Raw response (short):"
echo "$response" | jq '{total_count, incomplete_results}'


# =========================
# 🛡️ ERROR HANDLING
# =========================
if echo "$response" | jq -e '.message' > /dev/null; then
  echo "[ERROR] GitHub API failed:"
  echo "$response"
  exit 1
fi


# =========================
# 📊 CALCULATE DATA
# =========================
commit_count=$(echo "$response" | jq '.total_count // 0')

repos=$(echo "$response" | jq -r '
  [.items[].repository.full_name] 
  | unique 
  | join(", ")
')

echo "[LOG] Commit count : $commit_count"
echo "[LOG] Repos        : $repos"


# =========================
# ⏱️ TIME ANALYSIS
# =========================
times=$(echo "$response" | jq -r '
  [.items[].commit.committer.date] 
  | sort
')

first_time=$(echo "$times" | jq -r '.[0] // empty' | cut -d'T' -f2 | cut -c1-5)
last_time=$(echo "$times" | jq -r '.[-1] // empty' | cut -d'T' -f2 | cut -c1-5)

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

  message="📊 Daily Report — Hari Ini (UTC)

commit: 0

hari ini kosong…

tapi kamu masih punya besok 😌"

elif [ "$commit_count" -le 2 ]; then

  message="📊 Daily Report — Hari Ini (UTC)

commit: $commit_count
repo: $repos

gak banyak…
tapi kamu tetap gak nol hari ini 😏"

else

  message="📊 Daily Report — Hari Ini (UTC)

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