import { createAction } from "../../action/action.contract.js";
import {
  registerActionHandler,
  routeAction,
} from "../../action/action.router.js";
import { createTelegramSendMessageHandler } from "../../action/handlers/telegram.action.handler.js";
import { executeAction } from "../../action/action.executor.js";
import { sendTelegramMessage } from "../../../runtime/telegram/telegram.sender.js";
import { validateActionResult } from "../../action/action.result.validator.js";

const telegramHandler = createTelegramSendMessageHandler(sendTelegramMessage);

registerActionHandler("telegram.send_message", async (action) => {
  return executeAction(action, telegramHandler);
});

const action = createAction({
  id: "action-lifecycle-001",
  type: "telegram.send_message",
  source: {
    type: "agent",
  },
  payload: {
    chatId: 5004824900,
    text: "Action lifecycle test.",
  },
  context: {
    conversationId: "conversation-001",
    userId: "farid",
  },
});

const actionResult = await routeAction(action);

validateActionResult(actionResult);

console.log("Action lifecycle completed:");
console.log(actionResult);

if (actionResult.status === "success") {
  console.log("Next step: continue agent flow.");
}

if (actionResult.status === "failed") {
  console.log("Next step: handle action failure.");
}
