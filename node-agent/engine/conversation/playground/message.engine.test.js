import { createTelegramMessageEvent } from "../../../events/telegram/telegram.adapter.js";
import { handleMessage } from "../message.engine.js";

import { buildLLMContext } from "../../../llm/context/llm.context.js";
import { buildConversationContext } from "../../../llm/context/conversation.context.js";
import { buildConversationPrompt } from "../../../llm/prompts/conversation.prompt.js";

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
    text: "Halo Aurielle, masih inget sama pesan yang aku bilang ke kamu?",
  },
};

const event = createTelegramMessageEvent(telegramUpdate);

const result = await handleMessage(event);

console.log("\nAGENT CONTEXT:\n");
console.dir(result.context, { depth: null });

const llmContext = buildLLMContext({
  agentContext: result.context,
});

console.log("\nLLM CONTEXT:\n");
console.dir(llmContext, { depth: null });

const conversationContext = buildConversationContext({
  llmContext,
});

console.log("\nCONVERSATION CONTEXT:\n");
console.dir(conversationContext, { depth: null });

const prompt = buildConversationPrompt({
  conversationContext,
});

console.log("\nCONVERSATION PROMPT:\n");
console.log(JSON.stringify(prompt, null, 2));

console.log("\nPROMPT ASSERTIONS:\n");

console.log(
  "Has current conversation:",
  prompt.includes("Current conversation:"),
);

console.log("Has relevant knowledge:", prompt.includes("Relevant knowledge:"));

console.log(
  "Has relevant short-term memory:",
  prompt.includes("Relevant short-term memory:"),
);

console.log("\n7.9 TEST:\n");

console.log("Agent Context exists:", Boolean(result.context));

console.log("LLM Context has persona:", Boolean(llmContext.persona));

console.log(
  "LLM Context has relevant knowledge:",
  Array.isArray(llmContext.knowledge?.relevant),
);

console.log(
  "Conversation Context has current:",
  Boolean(conversationContext.current),
);

console.log(
  "Conversation Context has memory:",
  Array.isArray(conversationContext.memory?.shortTerm),
);

console.log("Prompt is string:", typeof prompt === "string");

console.log("Prompt is not empty:", prompt.length > 0);