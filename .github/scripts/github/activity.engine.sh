#!/bin/bash

CONFIG=".github/config/activity.config.json"

# =========================
# 💜 LOG SYSTEM
# =========================
header() { echo ""; echo "=============================="; echo "$1"; echo "=============================="; }
info() { echo "ℹ️ $1"; }
log() { echo "💜 $1"; }

# =========================
# 📦 CONFIG HELPER
# =========================
cfg() {
  jq -r "$1" "$CONFIG"
}

# =========================
# 📡 FETCH REPO EVENTS
# =========================
fetch_repo_events() {
  local repo=$1

  curl -s \
    -H "Authorization: token $ACTIVITY_GITHUB_TOKEN" \
    "https://api.github.com/repos/$repo/events"
}

# =========================
# 🧠 FETCH ALL EVENTS
# =========================
fetch_all_events() {
  header "📡 FETCH ALL REPOS"

  local repos=$(cfg '.repos[]')
  local all="[]"

  for repo in $repos; do
    info "Fetching: $repo"

    data=$(fetch_repo_events "$repo")

    all=$(jq -s 'add' <(echo "$all") <(echo "$data"))
  done

  echo "$all"
}

# =========================
# 📊 COUNT WEIGHTED SCORE
# =========================
calculate_score() {
  local data=$1
  local date=$2

  jq -r --arg d "$date" '
    map(select(.created_at | startswith($d))) 
    | group_by(.type)
    | map({type: .[0].type, count: length})
    | .[]
  ' <<< "$data"
}

# =========================
# ⚖️ SCORE CALCULATOR (bash sum)
# =========================
compute_score() {
  local data=$1
  local date=$2

  local total=0

  while read type count; do
    weight=$(jq -r --arg t "$type" '.weights[$t] // 1' "$CONFIG")
    total=$((total + count * weight))
  done < <(calculate_score "$data" "$date")

  echo "$total"
}

# =========================
# 🧩 MODE DECIDER
# =========================
get_mode() {
  local score=$1

  if [ "$score" -ge $(cfg '.thresholds.very_active') ]; then
    echo "very_active"
  elif [ "$score" -ge $(cfg '.thresholds.high') ]; then
    echo "high"
  elif [ "$score" -ge $(cfg '.thresholds.active') ]; then
    echo "active"
  else
    echo "idle"
  fi
}

# =========================
# 🎲 RANDOM TAG
# =========================
random_tag() {
  local mode=$1
  jq -r --arg m "$mode" '
    .modes[$m].tags | .[ (now|tostring|length) % length ]
  ' "$CONFIG"
}

# =========================
# 🧠 AI SUMMARY (RULE BASED)
# =========================
generate_summary() {
  local score=$1
  local mode=$2

  case $mode in
    very_active)
      echo "Hari ini kamu sangat produktif dengan aktivitas tinggi dan konsisten."
      ;;
    high)
      echo "Kamu cukup aktif, ada progress yang stabil dan terarah."
      ;;
    active)
      echo "Ada aktivitas ringan yang menunjukkan kamu tetap bergerak."
      ;;
    idle)
      echo "Kemarin kamu belum ada aktivitas berarti, mungkin sedang istirahat."
      ;;
  esac
}