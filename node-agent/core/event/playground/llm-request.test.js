import { buildLLMRequest } from "../../../llm/core/request.builder.js";

const request = buildLLMRequest({
  llmContext: {
    persona: {
      name: "Aurielle",
    },
    identity: {
      name: "Farid",
    },
    current: {
      message: {
        text: "Halo Aurielle",
      },
    },
    memory: {
      shortTerm: [],
      longTerm: [],
      relationship: [],
    },
  },

  type: "testconversation",
  system: "You are Aurielle.",
  prompt: "Respond to the current message.",

  model: "test-model",
  temperature: 0.7,
  max_tokens: 1000,
});

console.dir(request, { depth: null });
