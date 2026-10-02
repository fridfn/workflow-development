import { createTelegramMessageEvent } from "../../../events/telegram/telegram.adapter.js";
import { handleMessage } from "../message.engine.js";

const telegramUpdate = {
  message: {
    message_id: 114,
    from: {
      id: 5004824900,
      first_name: "Fubuki",
      username: "ShlrakamiFubuki",
    },
    chat: {
      id: 5004824900,
      type: "private",
    },
    text: "malem aurielle",
  },
};

const event = createTelegramMessageEvent(telegramUpdate);

const result = await handleMessage(event);

console.log("\nMESSAGE ENGINE RESULT:\n");
console.dir(result, { depth: null });

console.log("\nCURRENT CONVERSATION:\n");
console.dir(result.context.current.conversation, { depth: null });

console.log("\nRETRIEVED SHORT-TERM MEMORY:\n");
console.dir(result.context.memory.shortTerm, { depth: null });

console.log("\nRETRIEVED MEMORY COUNT:\n");
console.log(result.context.memory.shortTerm.length);
