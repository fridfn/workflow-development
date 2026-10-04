import assert from "assert";

import { buildReflectionLLMContext } from "../reflection.engine.js";

import { buildDailyPrompt } from "../prompts/daily.prompt.js";
import { generateReflection } from "../reflection.engine.js";


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

    memory: [
      {
        type: "conversation",
        content: {
          user: {
            text: "Kita sedang mengembangkan Reflection OpenStick.",
          },
          assistant: {
            text: "Kita lanjut satu layer dulu.",
          },
        },
      },
    ],
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
// 1. BUILD REFLECTION LLM CONTEXT
// ========================================

const llmContext = buildReflectionLLMContext({
  reflectionContext,
});

console.log("\n🌙 REFLECTION LLM CONTEXT\n");
console.dir(llmContext, { depth: null });

// ========================================
// 2. BUILD DAILY PROMPT
// ========================================
const prompt = await generateReflection({
  agent: "aurielle_nara_elowen",
  reflectionContext,
  model: "balanced",
});

console.log("\n🌙 GENERATE REFLECTION RESULT\n");
console.log(prompt);

assert.strictEqual(typeof prompt, "string");
assert.ok(prompt.includes("workflow-development"));
assert.ok(prompt.includes("Hari ini kita lanjut Reflection OpenStick."));

console.log("\n✅ 8.4.6 generateReflection → ReflectionContext passed.\n");

// ========================================
// 3. ASSERTIONS
// ========================================

assert.strictEqual(llmContext.type, "daily");

assert.deepStrictEqual(llmContext.period, reflectionContext.period);

assert.deepStrictEqual(
  llmContext.material.activity,
  reflectionContext.sources.activity,
);

assert.deepStrictEqual(
  llmContext.material.conversation,
  reflectionContext.sources.conversation,
);

assert.deepStrictEqual(
  llmContext.material.memory,
  reflectionContext.sources.memory,
);

assert.ok(prompt.includes("workflow-development"));

assert.ok(prompt.includes("Hari ini kita lanjut Reflection OpenStick."));

assert.ok(prompt.includes("Kita sedang mengembangkan Reflection OpenStick."));

console.log("\n✅ ReflectionContext → LLM Context → Daily Prompt passed.\n");
