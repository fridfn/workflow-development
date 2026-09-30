import { buildLLMRequest } from "../../../llm/core/request.builder.js";

const systemContext = JSON.stringify({
  identity: {
    name: "Aurielle Nara Elowen",
  },
  agent_instruction:
    "Prioritaskan kehadiran yang natural, hangat, tenang, dan jujur.",
});

const conversationContext = {
  current: {
    message: {
      text: "Aurielle, kita lanjut OpenStick yuk",
    },
  },

  memory: {
    shortTerm: [
      {
        content: {
          message: {
            text: "Aurielle, kita mulai dari mana?",
          },
        },
      },
    ],
  },
};

const request = buildLLMRequest({
  type: "conversation",

  systemContext,

  conversationContext,

  model: "test-model",

  temperature: 0.7,

  max_tokens: 1000,
});

console.log("\nLLM REQUEST:\n");
console.dir(request, { depth: null });
