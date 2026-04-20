#!/bin/bash

data=$(cat .github/messages/reaction.json)

reaction=$(echo "$data" | jq -r \
  --arg type "$type" \
  --arg mode "$mode" \
  '.[$type][$mode][]' | shuf -n 1)


# validasi
if [ -z "$reaction" ] || [ "$reaction" = "null" ]; then
  reaction="kamu tetap jalan hari ini… itu udah cukup
  ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
  "
fi

if [ -z "$reaction" ] || [ "$reaction" = "null" ]; then
  echo "No reaction found → exit"
  exit 1
fi

echo "REACTION=$reaction"