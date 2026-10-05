import { createActionIntent } from "../../action/action.intent.contract.js";
import { validateActionIntent } from "../../action/action.intent.validator.js";

import { buildActionFromIntent } from "../../action/action.builder.js";
import { validateAction } from "../../action/action.validator.js";

const intent = createActionIntent({
  type: "telegram.send_message",
  payload: {
    chatId: 5004824900,
    text: "Policy passed.",
  },
});

validateActionIntent(intent);

const action = buildActionFromIntent(intent, {
  id: "action-policy-integration-001",

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

console.log("Validated Intent:");
console.log(intent);

console.log("\nBuilt Action:");
console.log(action);

console.log("\nResult: Intent successfully passed policy and became Action.");
