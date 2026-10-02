import { createTelegramMessageEvent } from "../../../events/telegram/telegram.adapter.js";
import { handleMessage } from "../message.engine.js";

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

console.log("\nMESSAGE ENGINE RESULT:\n");
console.dir(result, { depth: null });

console.log("\nSTATUS:\n");
console.log(result.status);

console.log("\nCONVERSATION:\n");
console.dir(result.context.current.conversation, { depth: null });

console.log("\nMEMORY:\n");
console.dir(result.context.memory, { depth: null });

console.log("\nKNOWLEDGE:\n");
console.dir(result.context.knowledge, { depth: null });
