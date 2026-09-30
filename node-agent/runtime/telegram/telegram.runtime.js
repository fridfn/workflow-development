import { handleEvent } from "../../core/event/event.handler.js";
import { registerEventHandlers } from "../../core/event/event.router.js";
import { handleMessage } from "../../engine/conversation/message.engine.js";
import { createTelegramMessageEvent } from "../../events/telegram/telegram.adapter.js";

import { generateLLM } from "../../llm/core/generate.js";
import { buildLLMContext } from "../../llm/context/llm.context.js";
import { buildLLMRequest } from "../../llm/core/request.builder.js";
import { buildSystemContext } from "../../llm/context/system.context.js";
import { buildConversationPrompt } from "../../llm/prompts/conversation.prompt.js";
import { buildConversationContext } from "../../llm/context/conversation.context.js";

import { pollTelegram, acknowledgeTelegram } from "./telegram.poller.js";

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

      const llmContext = buildLLMContext({
        agentContext: result.context,
      });

      const systemContext = buildSystemContext({
        persona: llmContext.persona,
      });

      const conversationContext = buildConversationContext({
        llmContext,
      });

      const prompt = buildConversationPrompt({
        conversationContext,
      });

      const request = buildLLMRequest({
        type: "conversation",
        systemContext,
        prompt,
        model: "qwen/qwen3.8-27b",
        temperature: 0.8,
        max_tokens: 1000,
      });

      console.log("\nLLM REQUEST:\n");

      console.dir(
        {
          type: request.type,
          model: request.model,
          hasSystem:
            typeof request.system === "string" && request.system.length > 0,
          hasPrompt:
            typeof request.prompt === "string" && request.prompt.length > 0,
        },
        { depth: null },
      );

      const response = await generateLLM({
        provider: "groq",
        model: request.model,
        system: request.system,
        prompt: request.prompt,
        temperature: request.temperature,
        max_tokens: request.max_tokens,
      });

      console.log("\nLLM RESPONSE:\n");
      console.log(response);

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
