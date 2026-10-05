import { createLLMActionOutput } from "../../action/llm.output.contract.js";
import { validateLLMActionOutput } from "../../action/llm.output.validator.js";

import { normalizeLLMActionIntent } from "../../action/llm.intent.normalizer.js";

const output = createLLMActionOutput({
  intent: {
    type: "telegram.send_message",
    payload: {
      chatId: 5004824900,
      text: "Halo Farid",
    },
  },
});

validateLLMActionOutput(output);

const intent = normalizeLLMActionIntent(output);

console.log("LLM Output:");
console.log(output);

console.log("\nNormalized Action Intent:");
console.log(intent);
