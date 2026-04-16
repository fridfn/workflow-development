#!/bin/bash

if [ "$TYPE" = "combined" ]; then
  
  curl -s -X POST https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage \
    -d chat_id="$TELEGRAM_CHANNEL_ID" \
    --data-urlencode "text=$TEXT"

else
  
  curl -s -X POST https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage \
    -d chat_id="$TELEGRAM_CHANNEL_ID" \
    --data-urlencode "text=$GREETING"

  sleep 2

  curl -s -X POST https://api.telegram.org/bot$TELEGRAM_TOKEN/sendMessage \
    -d chat_id="$TELEGRAM_CHANNEL_ID" \
    --data-urlencode "text=$MESSAGE"

fi