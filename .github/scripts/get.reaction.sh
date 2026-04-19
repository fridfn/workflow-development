#!/bin/bash

data=$(cat .github/messages/"$mode_message".json)

# 1. pilih tone random dari mode
tone=$(echo "$data" | jq -r --arg mode "$mode" '
  .[$mode] | keys[]' | shuf -n 1)

# 2. ambil greeting dari tone itu
greeting=$(echo "$data" | jq -r --arg mode "$mode" --arg tone "$tone" '
  .[$mode][$tone].greetings[]' | shuf -n 1)

# 3. ambil message dari tone yang sama
message=$(echo "$data" | jq -r --arg mode "$mode" --arg tone "$tone" '
  .[$mode][$tone].messages[]' | shuf -n 1)

# 4. validasi
if [ -z "$tone" ] || [ -z "$greeting" ] || [ -z "$message" ]; then
  echo "No message found → exit"
  exit 1
fi
