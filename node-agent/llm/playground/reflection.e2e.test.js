import { generateReflection } from "../reflection.engine.js";

const agent = "aurielle_nara_elowen";
const model = "smart";

const contexts = [
  {
    type: "daily",
    period: {
      start: null,
      end: null,
      label: "August 22, 2026",
    },
    sources: {
      activity: [{ source: "commit", reply: "Daily test activity" }],
      conversation: [],
      memory: [],
    },
    context: {
      persona: null,
    },
  },

  {
    type: "weekly",
    period: {
      start: null,
      end: null,
      label: "Week 04 of august 2026",
    },
    sources: {
      activity: {
        stats: {
          total_generated: 6,
        },
        repositories: {},
      },
      conversation: [],
      memory: [],
    },
    context: {
      persona: null,
    },
  },

  {
    type: "monthly",
    period: {
      start: null,
      end: null,
      label: "august 2026",
    },
    sources: {
      activity: {
        stats: {},
        repositories: {},
      },
      conversation: [],
      memory: [],
    },
    context: {
      persona: null,
    },
  },

  {
    type: "yearly",
    period: {
      start: null,
      end: null,
      label: "2026",
    },
    sources: {
      activity: {
        stats: {},
        repositories: {},
      },
      conversation: [],
      memory: [],
    },
    context: {
      persona: null,
    },
  },
];

for (const reflectionContext of contexts) {
  console.log(`\n🌙 ${reflectionContext.type.toUpperCase()} REFLECTION E2E\n`);

  const result = await generateReflection({
    agent,
    model,
    reflectionContext,
  });

  console.log(result);

  if (!result) {
    throw new Error(
      `${reflectionContext.type} reflection did not produce a result`,
    );
  }

  console.log(`✅ ${reflectionContext.type} reflection passed`);
}

console.log("\n🎉 Reflection E2E passed.\n");


//node --env-file=.env llm/playground/reflection.e2e.test.js