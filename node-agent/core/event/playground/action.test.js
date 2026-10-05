import { createAction } from "../../action/action.contract.js";
import { validateAction } from "../../action/action.validator.js";

const action = createAction({
  id: "action-001",
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

  metadata: {
    priority: "normal",
  },
});

console.log(action);
console.log(validateAction(action));

import { createActionResult } from "../../action/action.result.contract.js";
import { validateActionResult } from "../../action/action.result.validator.js";

const result = createActionResult({
  actionId: "action-001",
  type: "telegram.send_message",
  status: "success",
  result: {
    messageId: 456,
  },
});

console.log(result);
console.log(validateActionResult(result));


const failedResult = createActionResult({
  actionId: "action-001",
  type: "telegram.send_message",
  status: "failed",
  error: {
    code: "TELEGRAM_API_ERROR",
    message: "Telegram API error",
  },
});

console.log(failedResult);
console.log(validateActionResult(failedResult));

// node --env-file=.env core/event/playground/action.test.js      