import assert from "assert";

import { buildReflectionLLMContext } from "../reflection.engine.js";

import { buildDailyPrompt } from "../prompts/daily.prompt.js";

const reflectionContext = {
  type: "daily",

  period: {
    start: "2026-10-04T00:00:00.000Z",
    end: "2026-10-04T23:59:59.999Z",
    label: "4 October 2026",
  },

  sources: {
    activity: [
      {
        repository: "workflow-development",
        type: "feat",
      },
    ],

    conversation: [
      {
        text: "Hari ini kita lanjut Reflection OpenStick.",
      },
    ],

    memory: [],
  },

  context: {
    persona: {
      identity: {
        name: "Aurielle Nara Elowen",
      },
    },
  },
};

// ========================================
// BUILD REFLECTION LLM CONTEXT
// ========================================

const llmContext = buildReflectionLLMContext({
  reflectionContext,
});

console.log("\n🌙 REFLECTION LLM CONTEXT\n");
console.dir(llmContext, { depth: null });

// ========================================
// BUILD DAILY PROMPT
// ========================================

const prompt = buildDailyPrompt({
  data: [],
  context: llmContext,
});

console.log("\n🌙 DAILY PROMPT\n");
console.log(prompt);

// ========================================
// ASSERTIONS
// ========================================

assert.strictEqual(typeof prompt, "string");

assert.ok(prompt.length > 0);

console.log("\n✅ Prompt is a string.");

console.log("\n✅ Prompt is not empty.");

console.log("\n✅ 8.4.3 Reflection LLM Context → Prompt passed.\n");
