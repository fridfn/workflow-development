const GROQ_MODELS = {
  // 🔥 fastest / cheapest
  instant: {
    key: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B Instant",
    tier: "fast",
    context: 8192,
    description: "Ultra fast, low cost, cocok untuk reflection ringan"
  },

  // ⚖️ balanced
  balanced: {
    key: "llama-3.1-70b-versatile",
    name: "Llama 3.1 70B Versatile",
    tier: "balanced",
    context: 8192,
    description: "Seimbang antara kualitas dan kecepatan"
  },

  // 🧠 reasoning strong
  smart: {
    key: "llama-3.3-70b-versatile",
    name: "Llama 3.3 70B",
    tier: "smart",
    context: 131072,
    description: "Lebih kuat untuk reasoning & reflection dalam"
  },
};

export function getModel(key = "instant") {
  return GROQ_MODELS[key].key;
}