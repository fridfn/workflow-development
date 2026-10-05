import { createLLMActionOutput } from "../../action/llm.output.contract.js";
import { validateLLMActionOutput } from "../../action/llm.output.validator.js";

import { normalizeLLMActionIntent } from "../../action/llm.intent.normalizer.js";

import { validateActionIntent } from "../../action/action.intent.validator.js";

import { buildActionFromIntent } from "../../action/action.builder.js";
import { validateAction } from "../../action/action.validator.js";

const output = createLLMActionOutput({
  intent: {
    type: "telegram.send_message",
    payload: {
      chatId: 5004824900,
      text: "Halo dari LLM.",
    },
  },
});

validateLLMActionOutput(output);

const intent = normalizeLLMActionIntent(output);

validateActionIntent(intent);

const action = buildActionFromIntent(intent, {
  id: "action-llm-integration-001",

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

console.log("LLM Output:");
console.log(output);

console.log("\nNormalized Intent:");
console.log(intent);

console.log("\nFinal Action:");
console.log(action);
