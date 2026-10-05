import { executeAction } from "../../action/action.executor.js";

const action = {
  id: "action-001",
  type: "telegram.send_message",
  version: 1,

  source: {
    type: "agent",
    eventId: null,
  },

  payload: {
    chatId: 123,
    text: "Halo Farid",
  },

  context: {
    conversationId: "conversation-001",
    userId: "farid",
  },

  metadata: {
    createdAt: new Date().toISOString(),
    priority: "normal",
  },
};

const successResult = await executeAction(action, async (action) => {
  return {
    messageId: 456,
    chatId: action.payload.chatId,
  };
});

console.log(successResult);

const failedResult = await executeAction(action, async () => {
  throw new Error("Telegram API unavailable.");
});

console.log(failedResult);
