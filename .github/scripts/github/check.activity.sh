#!/bin/bash

source .github/lib/activity_engine.sh

DATE=$(date -u -d "yesterday" +%Y-%m-%d)

header "🌙 GitHub Activity Engine v4"
info "Date: $DATE"

# =========================
# 📡 FETCH ALL
# =========================
data=$(fetch_all_events)

# =========================
# 🧠 SCORE
# =========================
score=$(compute_score "$data" "$DATE")

header "📊 ANALYSIS"
info "Score: $score"

# =========================
# 🎯 MODE
# =========================
mode=$(get_mode "$score")
tag=$(random_tag "$mode")
summary=$(generate_summary "$score" "$mode")

# =========================
# 📌 RESULT
# =========================
header "✨ RESULT"

echo "Mode    : $mode"
echo "Tag     : $tag"
echo "Score   : $score"
echo ""
echo "🧠 Summary:"
echo "$summary"

# =========================
# ENV EXPORT
# =========================
echo "activity_mode=$mode" >> $GITHUB_ENV
echo "activity_score=$score" >> $GITHUB_ENV
echo "activity_summary=$summary" >> $GITHUB_ENV

log "DONE 💜"