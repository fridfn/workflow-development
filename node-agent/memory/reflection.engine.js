import fs from "fs";
import { buildReflectionPrompt } from "./reflection/prompt.js";
import { generateReflection } from "./reflection/groq.js";
import {
  ensureJSONFile,
  readJSON,
  writeJSON
} from "../utils/fs.helper.js";

export async function runReflection({
  agent,
  paths,
  stats
}) {

  const {
    highlightsFile,
    reflectionFile
  } = paths;

  // =========================
  // 🔹 LOAD DATA
  // =========================
  const highlights =
    readJSON(highlightsFile, []);

  // ambil highlight penting aja
  const importantHighlights =
    highlights
      .sort((a, b) =>
        b.importance - a.importance
      )
      .slice(0, 10);

  // =========================
  // 🔹 BUILD PROMPT
  // =========================
  const prompt = buildReflectionPrompt({
    agent,
    highlights: importantHighlights,
    stats
  });

  // =========================
  // 🔹 GENERATE AI REFLECTION
  // =========================
  const reflection =
    await generateReflection(prompt);

  // =========================
  // 🔹 SAVE FILE
  // =========================
  ensureJSONFile(reflectionFile, []);

  const reflections =
    readJSON(reflectionFile, []);

  reflections.unshift({
    reflection,
    based_on: importantHighlights.length,
    created_at: Date.now()
  });

  writeJSON(
    reflectionFile,
    reflections.slice(0, 20)
  );

  return reflection;
}