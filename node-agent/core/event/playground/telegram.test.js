import fs from "fs";
import { createTelegramMessageEvent } from "../../../events/telegram/telegram.adapter.js";
import { handleEvent } from "../event.handler.js";
import { generateLLM } from "../../../llm/core/generate.js";
import { registerEventHandlers } from "../event.router.js";
import { handleMessage } from "../../../engine/conversation/message.engine.js";
import { buildLLMContext } from "../../../llm/context/llm.context.js";
import { buildSystemContext } from "../../../llm/context/system.context.js";
import { buildConversationContext } from "../../../llm/context/conversation.context.js";
import { buildLLMRequest } from "../../../llm/core/request.builder.js";

registerEventHandlers({
  "conversation.message": handleMessage,
});

const OFFSET_FILE = "./telegram.offset";

function loadOffset() {
  if (!fs.existsSync(OFFSET_FILE)) {
    return 0;
  }

  const value = fs.readFileSync(OFFSET_FILE, "utf-8").trim();
  return Number(value) || 0;
}

function saveOffset(offset) {
  fs.writeFileSync(OFFSET_FILE, String(offset), "utf-8");
}


async function getTelegramUpdates(offset = 0) {
  const token = process.env.TELEGRAM_TOKEN_AURIELLE;

  if (!token) {
    throw new Error("TELEGRAM_TOKEN is missing.");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/getUpdates?offset=${offset}`,
  );

  const result = await response.json();

  if (!result.ok) {
    throw new Error(`Telegram API error: ${result.description}`);
  }

  return result.result;
}

let offset = loadOffset();

while (true) {
  const updates = await getTelegramUpdates(offset);

  for (const telegramUpdate of updates) {
    offset = telegramUpdate.update_id + 1;
    saveOffset(offset);

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

    const request = buildLLMRequest({
      type: "conversation",
      systemContext,
      conversationContext,
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
        hasCurrent: !!request.prompt?.current,
        shortTermCount: request.prompt?.memory?.shortTerm?.length ?? 0,
      },
      { depth: null },
    );

    console.log("\nRESULT:");
    console.dir(result, { depth: null });

    const prompt = `
    Current conversation:
    ${JSON.stringify(request.prompt.current, null, 2)}
    
    Relevant short-term memory:
    ${JSON.stringify(request.prompt.memory.shortTerm, null, 2)}
    `;

    const response = await generateLLM({
      provider: "groq",
      model: request.model,
      system: request.system,
      prompt,
      temperature: request.temperature,
      max_tokens: request.max_tokens,
    });

    console.log("\nLLM RESPONSE:\n");
    console.log(response);

    const telegramToken = process.env.TELEGRAM_TOKEN_AURIELLE;

    if (!telegramToken) {
      throw new Error("TELEGRAM_TOKEN_AURIELLE is missing.");
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${telegramToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: event.context.chatId,
          text: response,
        }),
      },
    );

    const telegramResult = await telegramResponse.json();

    console.log("\nTELEGRAM RESPONSE:\n");
    console.dir(telegramResult, { depth: null });
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
}

console.log("\nTELEGRAM UPDATES:\n");
console.dir(updates, { depth: null });
