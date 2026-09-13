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
  yearly: buildYearlyPrompt
};

const config = JSON.parse(
  fs.readFileSync(
    "./config/agent.config.json",
    "utf-8"
  )
);

export async function generateReflection({
  agent,
  type,
  data,
  baseDir,
  fileName,
  outputFile,
  provider = "groq",
  model
}) {

  // ========================================
  // 🔹 LOAD AGENT
  // ========================================

  const agents = config[agent];

  if (!agents) {
    throw new Error(
      `Unknown agent: ${agent}`
    );
  }

  const agentSource =
    agents.system;

  const systemParts = {
    persona:
      agentSource.partner,

    behavior:
      agentSource.cara_bicara_aurielle_nara_elowen,

    closing:
      agentSource.penutup_dari_aurielle
  };

  const agentPersona =
    JSON.stringify(systemParts);


  // ========================================
  // 🔹 RESOLVE PROMPT
  // ========================================

  const buildPrompt =
    PROMPTS[type];

  if (!buildPrompt) {
    throw new Error(
      `Unknown reflection type: ${type}`
    );
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

    reflectionData =
      data
        .slice(-10)
        .map(item =>
          buildEntry(item)
        );
  }

  // ----------------------------------------
  // OBJECT DATA
  // Weekly / Monthly / Yearly
  // ----------------------------------------

  else if (
    data &&
    typeof data === "object"
  ) {

    reflectionData = [
      buildEntry({
        source:
          `reflection:${type}`,

        context:
          data
      })
    ];
  }


  // ----------------------------------------
  // INVALID / EMPTY DATA
  // ----------------------------------------

  else {

    reflectionData = [];

  }


  // ========================================
  // 🔹 DEBUG
  // ========================================

  console.log(
    `[REFLECTION] ${type.toUpperCase()}`
  );

  console.log(
    JSON.stringify(
      reflectionData,
      null,
      2
    )
  );


  // ========================================
  // 🔹 BUILD PROMPT
  // ========================================

  const prompt =
    buildPrompt({
      data:
        reflectionData
    });


  // ========================================
  // 🔹 GENERATE LLM
  // ========================================

  const raw =
    await generateLLM({
      provider,
      model,

      system:
        agentPersona,

      prompt,

      temperature: 0.8,

      max_tokens: 1200
    });


  // ========================================
  // 🔹 SAVE REFLECTION
  // ========================================

  if (outputFile) {

    fs.writeFileSync(
      outputFile,
      JSON.stringify(
        raw,
        null,
        2
      ),
      "utf-8"
    );

  }


  return raw;
}