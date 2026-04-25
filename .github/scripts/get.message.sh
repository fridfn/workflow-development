#!/bin/bash

# ==========================================
# 💜 Message Generator Script
# ------------------------------------------
# Input  : $mode_message (json file name)
#          $mode (time / condition mode)
#
# Output :
# TYPE=combined → TEXT
# TYPE=split    → GREETING + MESSAGE
#
# Flow:
# load json → pick tone → pick greeting/message
#           → validate → random output format
# ==========================================


#!/bin/bash
# 💜 Message Generator Script - Fixed

# Gunakan flag -r untuk raw output dan pastikan path benar
FILE_PATH=".github/messages/${mode_message}.json"

if [ ! -f "$FILE_PATH" ]; then
  echo "[ERROR] Message file not found" >&2
  exit 1
fi

# Ambil Tone
tone=$(jq -r --arg mode "$mode" '.[$mode] | keys | .[]' "$FILE_PATH" | shuf -n 1)

# Ambil Greeting & Message secara aman
greeting=$(jq -r --arg mode "$mode" --arg tone "$tone" '.[$mode][$tone].greetings[]' "$FILE_PATH" | shuf -n 1)
message=$(jq -r --arg mode "$mode" --arg tone "$tone" '.[$mode][$tone].messages[]' "$FILE_PATH" | shuf -n 1)

if [ -z "$greeting" ] || [ -z "$message" ]; then
  echo "[ERROR] Failed to generate message" >&2
  exit 1
fi

# Gacha Output Format
if [ $((RANDOM % 2)) -eq 0 ]; then
  echo "TYPE=combined"
  echo "TEXT=$greeting $message"
else
  echo "TYPE=split"
  echo "GREETING=$greeting"
  echo "MESSAGE=$message"
fi