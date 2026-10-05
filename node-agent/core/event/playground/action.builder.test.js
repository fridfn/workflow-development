import { createActionIntent } from "../../action/action.intent.contract.js";
import { validateActionIntent } from "../../action/action.intent.validator.js";

import { buildActionFromIntent } from "../../action/action.builder.js";
import { validateAction } from "../../action/action.validator.js";

const intent = createActionIntent({
  type: "telegram.send_message",
  payload: {
    chatId: 5004824900,
    text: "Halo Farid",
  },
});

validateActionIntent(intent);

const action = buildActionFromIntent(intent, {
  id: "action-builder-001",

  source: {
    type: "agent",
    eventId: null,
  },

  context: {
    conversationId: "conversation-001",
    userId: "farid",
  },
});

console.log("Intent:");
console.log(intent);

console.log("\nBuilt Action:");
console.log(action);

console.log("\nAction validation:");
console.log(validateAction(action));

// node --env-file=.env core/event/playground/action.builder.test.js