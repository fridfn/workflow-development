// llm/core/generate.js

import {
  generateGroq
} from "../providers/groq.provider.js";

export async function generateLLM({
  provider = "groq",
  model,
  system,
  prompt,
  temperature,
  max_tokens
}) {

  const messages = [
    {
      role: "system",
      content: system
    },
    {
      role: "user",
      content: prompt
    }
  ];

  switch (provider) {

    case "groq":
      return generateGroq({
        model,
        messages,
        temperature,
        max_tokens
      });

    default:
      throw new Error(
        `Unknown provider: ${provider}`
      );
  }
}