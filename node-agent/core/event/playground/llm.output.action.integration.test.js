import { parseLLMActionOutput } from "../../action/llm.output.parser.js";

import { validateLLMActionOutput } from "../../action/llm.output.validator.js";

import { normalizeLLMActionIntent } from "../../action/llm.intent.normalizer.js";

import { validateActionIntent } from "../../action/action.intent.validator.js";

import { buildActionFromIntent } from "../../action/action.builder.js";

import { validateAction } from "../../action/action.validator.js";

const llmContent = JSON.stringify({
  type: "action_intent",
  version: 1,
  intent: {
    type: "telegram.send_message",
    payload: {
      chatId: 5004824900,
      text: "Halo dari raw LLM output.",
    },
  },
});

// 1. Raw LLM content → object
const llmOutput = parseLLMActionOutput(llmContent);

// 2. Validate LLM output
validateLLMActionOutput(llmOutput);

// 3. LLM output → Action Intent
const intent = normalizeLLMActionIntent(llmOutput);

// 4. Validate Intent + Policy
validateActionIntent(intent);

// 5. Intent → Action
const action = buildActionFromIntent(intent, {
  id: "action-llm-output-001",

  source: {
    type: "agent",
    eventId: null,
  },

  context: {
    conversationId: "conversation-001",
    userId: "farid",
  },
});

// 6. Validate final Action
validateAction(action);

console.log("Raw LLM Content:");
console.log(llmContent);

console.log("\nParsed LLM Output:");
console.log(llmOutput);

console.log("\nAction Intent:");
console.log(intent);

console.log("\nFinal Action:");
console.log(action);
 