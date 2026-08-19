import "dotenv/config";

const GROQ_MODELS = {
  // ========================================
  // ⚡ FAST
  // ========================================
  instant: {
    key: "openai/gpt-oss-20b",
    name: "GPT OSS 20B",
    tier: "fast",
    context: 131072,
    description:
      "Cepat dan ringan untuk reflection serta proses sederhana"
  },

  // ========================================
  // ⚖️ BALANCED
  // ========================================
  balanced: {
    key: "qwen/qwen3.6-27b",
    name: "Qwen 3.6 27B",
    tier: "balanced",
    context: 131072,
    description:
      "Seimbang untuk analisis dan proses agent"
  },

  // ========================================
  // 🧠 SMART
  // ========================================
  smart: {
    key: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    tier: "smart",
    context: 131072,
    description:
      "Model lebih kuat untuk reasoning dan reflection mendalam"
  }
};


// ========================================
// 🔹 GET MODEL
// ========================================

export function getModel(key = "instant") {

  const model = GROQ_MODELS[key];

  if (!model) {
    throw new Error(
      `Unknown model profile: ${key}`
    );
  }

  return model.key;
}


// ========================================
// 🔹 GET MODEL INFO
// ========================================

export function getModelInfo(key = "instant") {

  const model = GROQ_MODELS[key];

  if (!model) {
    throw new Error(
      `Unknown model profile: ${key}`
    );
  }

  return {
    ...model
  };
}


// ========================================
// 🔹 GET ALL MODELS
// ========================================

export function getModels() {

  return Object.fromEntries(
    Object.entries(GROQ_MODELS)
      .map(([key, model]) => [
        key,
        { ...model }
      ])
  );

}