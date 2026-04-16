#!/bin/bash

data=$(cat .github/messages/appreciation.json)

greeting=$(echo "$data" | jq -r --arg mode "$mode" '.[$mode].greetings[]' | shuf -n 1)
message=$(echo "$data" | jq -r --arg mode "$mode" '.[$mode].messages[]' | shuf -n 1)

if [ -z "$greeting" ] || [ -z "$message" ]; then
  echo "No message found → exit"
  exit 1
fi

# 🎲 gacha
gacha=$((RANDOM % 2))

if [ "$gacha" -eq 0 ]; then
  echo "TYPE=combined"
  echo "TEXT=$greeting $message"
else
  echo "TYPE=split"
  echo "GREETING=$greeting"
  echo "MESSAGE=$message"
fi