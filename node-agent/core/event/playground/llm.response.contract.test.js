import { createLLMResponse } from "../../action/llm.response.contract.js";

import { validateLLMResponse } from "../../action/llm.response.validator.js";

const messageResponse = createLLMResponse({
  type: "message",
  content: "Halo Farid.",
});

validateLLMResponse(messageResponse);

const actionResponse = createLLMResponse({
  type: "action",
  action: {
    type: "action_intent",
    version: 1,
    intent: {
      type: "telegram.send_message",
      payload: {
        chatId: 5004824900,
        text: "Halo dari Action.",
      },
    },
  },
});

validateLLMResponse(actionResponse);

console.log("Message Response:");
console.log(messageResponse);

console.log("\nAction Response:");
console.log(actionResponse);
