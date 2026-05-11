// llm/providers/groq.provider.js

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function generateGroq({
  model,
  messages,
  temperature = 0.7,
  max_tokens = 1024
}) {

  const completion =
    await groq.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens
    });

  return completion
    .choices?.[0]
    ?.message?.content;
}