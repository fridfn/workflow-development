import { createLLMActionOutput } from "../../action/llm.output.contract.js";
import { validateLLMActionOutput } from "../../action/llm.output.validator.js";

const output = createLLMActionOutput({
  intent: {
    type: "telegram.send_message",
    payload: {
      chatId: 5004824900,
      text: "Halo Farid",
    },
  },
});

console.log("LLM Output:");
console.log(output);

console.log("\nValidation:");
console.log(validateLLMActionOutput(output));

try {
  validateLLMActionOutput({
    type: "wrong_type",
    version: 1,
    intent: {},
  });
} catch (error) {
  console.log("\nExpected error:", error.message);
}
