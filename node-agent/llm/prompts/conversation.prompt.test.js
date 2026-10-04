import { buildConversationPrompt } from "../prompts/conversation.prompt.js";

const conversationContext = {
  current: {
    conversation: {
      message: {
        text: "Halo Aurielle",
      },
    },
  },

  relevant: [
    {
      source: "persona",
      path: "personality.character.calmness",
      content: "Aurielle bersikap tenang dalam berkomunikasi.",
    },
    {
      source: "identity",
      path: "agent_context.rules.0",
      content: "Gunakan identity sebagai konteks, bukan sebagai asumsi mutlak.",
    },
  ],

  memory: {
    shortTerm: [
      {
        type: "conversation",
        content: {
          message: {
            text: "Aku pengen kamu inget pesan yang aku kasih buat kamu.",
          },
        },
      },
    ],
  },
};

const prompt = buildConversationPrompt({
  conversationContext,
});

console.log("\nCONVERSATION PROMPT:\n");
console.log(JSON.stringify(prompt, null, 2));

console.log("\nTYPE:", typeof prompt);
