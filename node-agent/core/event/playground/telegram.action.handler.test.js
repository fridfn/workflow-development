import { createTelegramSendMessageHandler } from "../../action/handlers/telegram.action.handler.js";

const mockSendMessage = async ({ chatId, text }) => {
  return {
    messageId: 456,
    chatId,
    text,
  };
};

const handleTelegramSendMessage =
  createTelegramSendMessageHandler(mockSendMessage);

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

const result = await handleTelegramSendMessage(action);

console.log(result);

try {
  await handleTelegramSendMessage({
    ...action,
    payload: {
      text: "Tanpa chat ID",
    },
  });
} catch (error) {
  console.log("Expected error:", error.message);
}

try {
  await handleTelegramSendMessage({
    ...action,
    payload: {
      chatId: 123,
    },
  });
} catch (error) {
  console.log("Expected error:", error.message);
}


// node --env-file=.env core/event/playground/telegram.action.handler.test.js