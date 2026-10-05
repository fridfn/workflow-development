
import { parseLLMOutput } from "../../action/llm.output.parser.js";
import { normalizeLLMResponse } from "../../action/llm.response.normalizer.js";

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

const messageResponse = normalizeLLMResponse(messageOutput);
const actionResponse = normalizeLLMResponse(actionOutput);

console.log("Message Response:");
console.log(messageResponse);

console.log("\nAction Response:");
console.log(actionResponse);