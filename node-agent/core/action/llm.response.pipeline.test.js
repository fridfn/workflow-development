import { parseLLMActionOutput } from "./llm.output.parser.js";

import { normalizeLLMResponse } from "./llm.response.normalizer.js";

import { validateLLMResponse } from "./llm.response.validator.js";

const rawMessage = JSON.stringify({
  content: "Halo Farid.",
});

const rawAction = JSON.stringify({
  type: "action_intent",
  version: 1,
  intent: {
    type: "telegram.send_message",
    payload: {
      chatId: 5004824900,
      text: "Halo dari Action.",
    },
  },
});

const parsedMessage = parseLLMActionOutput(rawMessage);
const messageResponse = normalizeLLMResponse(parsedMessage);
validateLLMResponse(messageResponse);

const parsedAction = parseLLMActionOutput(rawAction);
const actionResponse = normalizeLLMResponse(parsedAction);
validateLLMResponse(actionResponse);

console.log("Message Pipeline:");
console.log(messageResponse);

console.log("\nAction Pipeline:");
console.log(actionResponse);
