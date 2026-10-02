import { handleEvent } from "../../core/event/event.handler.js";
import { registerEventHandlers } from "../../core/event/event.router.js";
import { pollTelegram, acknowledgeTelegram } from "./telegram.poller.js";
import { handleMessage } from "../../engine/conversation/message.engine.js";
import { saveConversation } from "../../engine/conversation/conversation.memory.js";
import { createTelegramMessageEvent } from "../../events/telegram/telegram.adapter.js";

import { generateConversationResponse } from "../../llm/tasks/conversation.task.js";
import { sendTelegramMessage } from "./telegram.sender.js";

registerEventHandlers({
  "conversation.message": handleMessage,
});

async function startTelegramRuntime() {
  console.log("🌙 Telegram runtime started.");

  while (true) {
    const { updates, nextOffset } = await pollTelegram();

    for (const telegramUpdate of updates) {
      if (!telegramUpdate.message) {
        continue;
      }

      const event = createTelegramMessageEvent(telegramUpdate);
      const result = await handleEvent(event);

      const response = await generateConversationResponse({
        agentContext: result.context,
      });

      const conversationPair = {
        user: {
          messageId: event.payload.messageId,
          text: event.payload.text,
        },
        assistant: {
          text: response,
        },
      };
      
      const memory = saveConversation(conversationPair);
      
      const telegramResult = await sendTelegramMessage({
        chatId: event.context.chatId,
        text: response,
      });

      console.log("\nTELEGRAM RESPONSE:\n");
      console.dir(telegramResult, { depth: null });
    }

    if (updates.length > 0) {
      acknowledgeTelegram(nextOffset);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

startTelegramRuntime();
