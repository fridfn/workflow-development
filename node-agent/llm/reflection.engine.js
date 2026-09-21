import fs from "fs";

import { generateLLM } from "./core/generate.js";
import { buildDailyPrompt } from "./prompts/daily.prompt.js";
import { buildWeeklyPrompt } from "./prompts/weekly.prompt.js";
import { buildMonthlyPrompt } from "./prompts/monthly.prompt.js";
import { buildYearlyPrompt } from "./prompts/yearly.prompt.js";

import { buildEntry } from "../engine/enrichment/entry.builder.js";

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
  type,
  data,
  outputFile,
  provider = "groq",
  model,
}) {
  // ========================================
  // 🔹 LOAD AGENT
  // ========================================

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

  // ========================================
  // 🔹 RESOLVE PROMPT
  // ========================================

  const buildPrompt = PROMPTS[type];

  if (!buildPrompt) {
    throw new Error(`Unknown reflection type: ${type}`);
  }

  // ========================================
  // 🔹 ENRICHMENT
  // ========================================

  let reflectionData;

  // ----------------------------------------
  // ARRAY DATA
  // Daily
  // ----------------------------------------

  if (Array.isArray(data)) {
    reflectionData = data.slice(-12).map((item) => item);
  }

  // ----------------------------------------
  // OBJECT DATA
  // Weekly / Monthly / Yearly
  // ----------------------------------------
  else if (data && typeof data === "object") {
    reflectionData = [
      {
        source: `reflection:${type}`,
        context: data,
      },
    ];
  } else {
    reflectionData = [];
  }

  // ========================================
  // 🔹 DEBUG
  // ========================================

  // console.log(`[REFLECTION] ${type.toUpperCase()}`);

  // console.log(JSON.stringify(reflectionData, null, 2));

  // ========================================
  // 🔹 GENERATE LLM
  // ========================================

    const raw = await generateLLM({
      provider,
      model,

      system: agentPersona,

      prompt: JSON.stringify(reflectionData, null, 2),

      temperature: 0.8,

      max_tokens: 1200,
    });

    // ========================================
    // 🔹 SAVE REFLECTION
    // ========================================

    if (outputFile) {

      fs.writeFileSync(
        outputFile,
          raw,
          null,
          2,
        "utf-8"
      );

    }

    return raw;
}
