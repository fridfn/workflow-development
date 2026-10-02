import { createTelegramMessageEvent } from "../../../events/telegram/telegram.adapter.js";
import { handleEvent } from "../../../core/event/event.handler.js";
import { registerEventHandlers } from "../../../core/event/event.router.js";
import { handleMessage } from "../message.engine.js";
import {
  saveConversation,
  loadShortTermMemory,
} from "../conversation.memory.js";
import { generateConversationResponse } from "../../../llm/tasks/conversation.task.js";

registerEventHandlers({
  "conversation.message": handleMessage,
});

const telegramUpdate = {
  message: {
    message_id: 115,
    from: {
      id: 5004824900,
      first_name: "Fubuki",
      username: "ShlrakamiFubuki",
    },
    chat: {
      id: 5004824900,
      type: "private",
    },
    text: "malem aurielle, kamu inget gak pesan yang aku bilang ke kamu waktu itu?",
  },
};

const event = createTelegramMessageEvent(telegramUpdate);

console.log("\n1. USER MESSAGE:\n");
console.log(event.payload.text);

const result = await handleEvent(event);

console.log("\n2. RETRIEVED MEMORY:\n");
console.dir(result.context.memory.shortTerm, { depth: null });

const response = await generateConversationResponse({
  agentContext: result.context,
});

console.log("\n3. ASSISTANT RESPONSE:\n");
console.log(response);

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

console.log("\n4. SAVED CONVERSATION PAIR:\n");
console.dir(memory, { depth: null });

const memories = loadShortTermMemory();

console.log("\n5. SHORT-TERM MEMORY AFTER SAVE:\n");
console.dir(memories, { depth: null });

const savedMemory = memories.find((item) => item.id === memory.id);

console.log("\n6. MEMORY FOUND AFTER SAVE:\n");
console.dir(savedMemory, { depth: null });


//node --env-file=.env engine/conversation/playground/memory.lifecycle.test.js