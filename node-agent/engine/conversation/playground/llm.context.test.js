import { createTelegramMessageEvent } from "../../../events/telegram/telegram.adapter.js";

import { handleMessage } from "../message.engine.js";

import { buildLLMContext } from "../../../llm/context/llm.context.js";

const telegramUpdate = {
  message: {
    message_id: 123,
    from: {
      id: 456,
      first_name: "Farid",
      username: "fridfn",
    },
    chat: {
      id: 987654,
      type: "private",
    },
    text: "Halo Aurielle, ini test message engine.",
  },
};

const event = createTelegramMessageEvent(telegramUpdate);

const result = await handleMessage(event);

const llmContext = buildLLMContext({
  agentContext: result.context,
});

console.log("\nLLM CONTEXT:\n");
console.dir(llmContext, { depth: null });
