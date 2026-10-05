import { createActionIntent } from "../../action/action.intent.contract.js";
import { validateActionIntent } from "../../action/action.intent.validator.js";

const intent = createActionIntent({
  type: "telegram.send_message",
  payload: {
    chatId: 5004824900,
    text: "Halo Farid",
  },
});

console.log(intent);
console.log("\nValidation:");
console.log(validateActionIntent(intent));

try {
  validateActionIntent({
    payload: {},
  });
} catch (error) {
  console.log("\nExpected error:", error.message);
}

try {
  validateActionIntent({
    type: "unknown.action",
    payload: {},
  });
} catch (error) {
  console.log("\nExpected error:", error.message);
}