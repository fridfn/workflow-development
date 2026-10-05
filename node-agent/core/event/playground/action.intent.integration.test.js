import { createActionIntent } from "../../action/action.intent.contract.js";
import { validateActionIntent } from "../../action/action.intent.validator.js";

import { buildActionFromIntent } from "../../action/action.builder.js";
import { validateAction } from "../../action/action.validator.js";

import {
  registerActionHandler,
  routeAction,
} from "../../action/action.router.js";

import { createTelegramSendMessageHandler } from "../../action/handlers/telegram.action.handler.js";

import { executeAction } from "../../action/action.executor.js";
import { validateActionResult } from "../../action/action.result.validator.js";

const mockSendMessage = async ({ chatId, text }) => {
  return {
    messageId: 999,
    chatId,
    text,
  };
};

const telegramHandler = createTelegramSendMessageHandler(mockSendMessage);

registerActionHandler("telegram.send_message", async (action) => {
  return executeAction(action, telegramHandler);
});

const intent = createActionIntent({
  type: "telegram.send_message",
  payload: {
    chatId: 5004824900,
    text: "Halo dari Action Intent.",
  },
});

validateActionIntent(intent);

const action = buildActionFromIntent(intent, {
  id: "action-intent-integration-001",

  source: {
    type: "agent",
    eventId: null,
  },

  context: {
    conversationId: "conversation-001",
    userId: "farid",
  },
});

validateAction(action);

const actionResult = await routeAction(action);

validateActionResult(actionResult);

console.log("Intent:");
console.log(intent);

console.log("\nAction:");
console.log(action);

console.log("\nAction Result:");
console.log(actionResult);
