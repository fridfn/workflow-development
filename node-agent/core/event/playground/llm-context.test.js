import { createTelegramMessageEvent } from "../../../events/telegram/telegram.adapter.js";
import { handleMessage } from "../../../engine/conversation/message.engine.js";
import { buildLLMContext } from "../../../llm/context/llm.context.js";

const update = {
  message: {
    message_id: 999,
    text: "Aurielle, kita lanjut OpenStick yuk",

    chat: {
      id: 123,
      type: "private",
    },

    from: {
      id: 456,
      first_name: "Farid",
      username: "fridfn",
    },
  },
};

const event = createTelegramMessageEvent(update);

const result = await handleMessage(event);

const llmContext = buildLLMContext({
  agentContext: result.context,
});

console.log("\nLLM CONTEXT:\n");

console.dir(llmContext, {
  depth: null,
});
