import { createAction } from "../../action/action.contract.js";
import { validateAction } from "../../action/action.validator.js";

import {
  registerActionHandler,
  routeAction,
} from "../../action/action.router.js";

import { createTelegramSendMessageHandler } from "../../action/handlers/telegram.action.handler.js";

import { executeAction } from "../../action/action.executor.js";
import { validateActionResult } from "../../action/action.result.validator.js";

import { sendTelegramMessage } from "../../../runtime/telegram/telegram.sender.js";

const telegramHandler = createTelegramSendMessageHandler(sendTelegramMessage);

registerActionHandler("telegram.send_message", async (action) => {
  return executeAction(action, telegramHandler);
});

const action = createAction({
  id: "action-real-001",
  type: "telegram.send_message",
  source: {
    type: "agent",
    eventId: null,
  },
  payload: {
    chatId: 5004824900,
    text: "Halo aurielle",
  },
  context: {
    conversationId: "conversation-001",
    userId: "farid",
  },
});

validateAction(action);

console.log("Action:");
console.log(action);

console.log("\nRouting to Telegram executor...");

const result = await routeAction(action);

console.log("\nAction Result:");
console.log(result);

validateActionResult(result);