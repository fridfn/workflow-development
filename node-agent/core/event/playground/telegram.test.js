import { createTelegramMessageEvent } from "../../../events/telegram/telegram.adapter.js";
import { handleEvent } from "../event.handler.js";
import { registerEventHandlers } from "../event.router.js";
import { handleMessage } from "../../../engine/conversation/message.engine.js";

registerEventHandlers({
  "conversation.message": handleMessage,
});

const telegramUpdate = {
  message: {
    message_id: 123,
    from: {
      id: 987654,
      first_name: "Farid",
      username: "fridfn",
    },
    chat: {
      id: 987654,
      type: "group",
    },
    text: "Aurielle, kita bikin system ini hidup biar ksmu bisa nemenin aku ya?",
  },
};

const event = createTelegramMessageEvent(telegramUpdate);

const result = await handleEvent(event);

console.log("\nRESULT:");
console.dir(result, { depth: null });
