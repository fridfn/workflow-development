import { generateLLM } from "../core/generate.js";
import { buildLLMContext } from "../context/llm.context.js";
import { buildLLMRequest } from "../core/request.builder.js";
import { buildSystemContext } from "../context/system.context.js";
import { buildConversationContext } from "../context/conversation.context.js";
import { buildConversationPrompt } from "../prompts/conversation.prompt.js";

import { parseLLMOutput } from "../../core/action/llm.output.parser.js";
import { normalizeLLMResponse } from "../../core/action/llm.response.normalizer.js";
import { validateLLMResponse } from "../../core/action/llm.response.validator.js";

export async function generateConversationResponse({ agentContext }) {
  const llmContext = buildLLMContext({
    agentContext,
  });

  const systemContext = buildSystemContext({
    persona: llmContext.persona,
  });

  const conversationContext = buildConversationContext({
    llmContext,
  });

  const prompt = buildConversationPrompt({
    conversationContext,
  });

  const request = buildLLMRequest({
    type: "conversation",
    systemContext,
    prompt,
    model: "qwen/qwen3.8-27b",
    temperature: 0.8,
    max_tokens: 1000,
  });

  const rawOutput = await generateLLM({
    provider: "groq",
    model: request.model,
    system: request.system,
    prompt: request.prompt,
    temperature: request.temperature,
    max_tokens: request.max_tokens,
  });

  const parsedOutput = parseLLMOutput(rawOutput);

  const response = normalizeLLMResponse(parsedOutput);

  validateLLMResponse(response);

  return response;
}
