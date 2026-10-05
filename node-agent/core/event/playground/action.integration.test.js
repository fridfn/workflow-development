import { createAction } from "../../action/action.contract.js";
import { validateAction } from "../../action/action.validator.js";

import {
  registerActionHandler,
  routeAction,
} from "../../action/action.router.js";

import { createTelegramSendMessageHandler } from "../../action/handlers/telegram.action.handler.js";

import { executeAction } from "../../action/action.executor.js";
import { validateActionResult } from "../../action/action.result.validator.js";

let shouldFail = false;

const mockSendMessage = async ({ chatId, text }) => {
  if (shouldFail) {
    throw new Error("Telegram API unavailable.");
  }

  return {
    messageId: 456,
    chatId,
    text,
  };
};

const telegramHandler = createTelegramSendMessageHandler(mockSendMessage);

registerActionHandler("telegram.send_message", async (action) => {
  return executeAction(action, telegramHandler);
});

const action = createAction({
  id: "action-integration-001",
  type: "telegram.send_message",
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
});

validateAction(action);

const successResult = await routeAction(action);

console.log("SUCCESS:");
console.log(successResult);

validateActionResult(successResult);

shouldFail = true;

const failedResult = await routeAction(action);

console.log("\nFAILED:");
console.log(failedResult);

validateActionResult(failedResult);
