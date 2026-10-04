import fs from "fs";

import { generateLLM } from "./core/generate.js";
import { buildDailyPrompt } from "./prompts/daily.prompt.js";
import { buildWeeklyPrompt } from "./prompts/weekly.prompt.js";
import { buildMonthlyPrompt } from "./prompts/monthly.prompt.js";
import { buildYearlyPrompt } from "./prompts/yearly.prompt.js";

const PROMPTS = {
  daily: buildDailyPrompt,
  weekly: buildWeeklyPrompt,
  monthly: buildMonthlyPrompt,
  yearly: buildYearlyPrompt,
};

const config = JSON.parse(
  fs.readFileSync("./config/agent.config.json", "utf-8"),
);

export async function generateReflection({
  agent,
  reflectionContext,
  outputFile,
  provider = "groq",
  model,
}) {
    if (!reflectionContext) {
      throw new Error("ReflectionContext is required");
    }

    const type = reflectionContext.type;

    const agents = config[agent];

    if (!agents) {
      throw new Error(`Unknown agent: ${agent}`);
    }

    const agentSource = agents.system;

    const systemParts = {
      persona: agentSource.partner,
      behavior: agentSource.gaya_bicara,
    };

    const agentPersona = JSON.stringify(systemParts);

    const buildPrompt = PROMPTS[type];

    if (!buildPrompt) {
      throw new Error(`Unknown reflection type: ${type}`);
    }

    const reflectionLLMContext = buildReflectionLLMContext({
      reflectionContext,
    });

    const prompt = buildPrompt({
      context: reflectionLLMContext,
    });

  const raw = await generateLLM({
    provider,
    model,

    system: agentPersona,

    prompt,

    temperature: 0.8,

    max_tokens: 2000,
  });

  // ========================================
  // 🔹 SAVE REFLECTION
  // ========================================

  if (outputFile) {
    fs.writeFileSync(outputFile, raw, null, 2, "utf-8");
  }

   return raw;
}

export function buildReflectionLLMContext({ reflectionContext }) {
  return {
    type: reflectionContext?.type ?? null,

    period: reflectionContext?.period ?? null,

    material: {
      activity: reflectionContext?.sources?.activity ?? [],
      conversation: reflectionContext?.sources?.conversation ?? [],
      memory: reflectionContext?.sources?.memory ?? [],
    },

    writing: {
      persona: reflectionContext?.context?.persona ?? null,
    },
  };
}