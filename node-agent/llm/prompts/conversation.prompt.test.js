import { buildConversationPrompt } from "../prompts/conversation.prompt.js";

const conversationContext = {
  current: {
    conversation: {
      message: {
        text: "Halo Aurielle",
      },
    },
  },

  memory: {
    shortTerm: [
      {
        type: "conversation",
        content: {
          message: {
            text: "Aku sedang mengembangkan OpenStick.",
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
console.log(prompt);

console.log("\nTYPE:", typeof prompt);
