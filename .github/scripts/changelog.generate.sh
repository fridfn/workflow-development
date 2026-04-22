#!/bin/bash

set -e

# ==========================================
# 💜 Auto Changelog Generator
# ==========================================

TODAY=$(date +"%Y-%m-%d")

# 🔹 ambil commit hari ini
commits=$(git log --since="today" --pretty=format:"%s")

# 🔹 kategori
features=""
fixes=""
docs=""
refactors=""
others=""

# 🔹 parsing commit
while IFS= read -r line; do
  if [[ "$line" == feat* ]]; then
    msg=$(echo "$line" | cut -d':' -f2-)
    features="$features\n- $msg"
    
  elif [[ "$line" == fix* ]]; then
    msg=$(echo "$line" | cut -d':' -f2-)
    fixes="$fixes\n- $msg"
    
  elif [[ "$line" == docs* ]]; then
    msg=$(echo "$line" | cut -d':' -f2-)
    docs="$docs\n- $msg"
    
  elif [[ "$line" == refactor* ]]; then
    msg=$(echo "$line" | cut -d':' -f2-)
    refactors="$refactors\n- $msg"
    
  else
    others="$others\n- $line"
  fi
done <<< "$commits"


# 🔹 build changelog
changelog="## 📦 Changelog — $TODAY\n"

[ -n "$features" ] && changelog="$changelog\n✨ Features$features"
[ -n "$fixes" ] && changelog="$changelog\n\n🐛 Fixes$fixes"
[ -n "$docs" ] && changelog="$changelog\n\n📚 Docs$docs"
[ -n "$refactors" ] && changelog="$changelog\n\n♻️ Refactor$refactors"
[ -n "$others" ] && changelog="$changelog\n\n🧩 Others$others"


# 🔹 output ke workflow
source .github/scripts/core/multiline.sh
set_multiline "CHANGELOG" "$changelog"