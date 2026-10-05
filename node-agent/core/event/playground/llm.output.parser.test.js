import { parseLLMOutput } from "../../action/llm.output.parser.js";

const messageContent = "Halo Farid, kita mulai dari event system dulu.";

const actionContent = JSON.stringify({
  type: "action_intent",
  version: 1,
  intent: {
    type: "telegram.send_message",
    payload: {
      chatId: 5004824900,
      text: "Halo Farid.",
    },
  },
});

const messageOutput = parseLLMOutput(messageContent);
const actionOutput = parseLLMOutput(actionContent);

console.log("Message Output:");
console.log(messageOutput);

console.log("\nAction Output:");
console.log(actionOutput);
