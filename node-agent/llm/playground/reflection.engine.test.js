import { generateReflection } from "../reflection.engine.js";

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
