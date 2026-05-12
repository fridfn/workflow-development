import fs from "fs";
import { generateLLM } from "./core/generate.js";
import { safeJSONParse } from "./parsers/json.parser.js";
import { buildDailyPrompt } from "./prompts/daily.prompt.js";
import { buildWeeklyPrompt } from "./prompts/weekly.prompt.js";
import { buildMonthlyPrompt } from "./prompts/monthly.prompt.js";
import { buildYearlyPrompt } from "./prompts/yearly.prompt.js";

const PROMPTS = {
  daily: buildDailyPrompt,
  weekly: buildWeeklyPrompt,
  monthly: buildMonthlyPrompt,
  yearly: buildYearlyPrompt
};

export async function generateReflection({
  type,
  data,
  outputFile,
  provider = "groq",
  model = "llama-3.1-8b-instant"
}) {

  const buildPrompt =
    PROMPTS[type];

  if (!buildPrompt) {
    throw new Error(
      `Unknown reflection type: ${type}`
    );
  }

  const prompt =
    buildPrompt(data);

  const raw =
    await generateLLM({
      provider,
      model,

      system:
        "You are a reflective memory AI.",

      prompt,

      temperature: 0.8,
      max_tokens: 1200
    });

  const parsed =
    safeJSONParse(raw);

  fs.writeFileSync(
    outputFile,
    JSON.stringify(
      parsed,
      null,
      2
    )
  );

  return parsed;
}