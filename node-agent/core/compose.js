import { logDebug, logSection, logWarn } from "../utils/logger.js";

function pickRandom(arr, seed) {
  return arr[seed % arr.length];
}

export function composeReply(agentConfig, mode, tag, seedGreet, seedMsg, override) {
  logSection("COMPOSE START");
  
  const root = agentConfig.message;
  
  const compose = override
    ? override.split(",")
    : (agentConfig.compose?.[tag] || agentConfig.compose?.default || ["greeting", "message"]);
    
  logDebug("COMPOSE", "Compose mode", { compose });

  // =========================
  // 🎯 CATEGORY
  // =========================
  const category = Object.entries(root).find(([_, val]) => val[mode]);

  if (!category) {
    logDebug("COMPOSE", "No category found", { mode });
    return { reply: null, debug: "No category" };
  }

  const [categoryName, categoryData] = category;

  logDebug("COMPOSE", "Category selected", { categoryName });

  // =========================
  // 🎯 TONE
  // =========================
  const group = categoryData[mode];
  const tones = Object.keys(group);
  
  const modePrefix = mode;
  
  const filteredTones = tones.filter(t =>
    t.startsWith(modePrefix)
  );
  
  const finalTones = filteredTones.length > 0 ? filteredTones : tones;
  
  if (tones.length === 0) {
    logDebug("COMPOSE", "No tones available");
    return { reply: null, debug: "No tones" };
  }

  const toneIndex = seedGreet % finalTones.length;
  const tone = finalTones[toneIndex];
  
  logDebug("COMPOSE", "Tone selection", {
    mode,
    totalTones: tones.length,
    filteredCount: filteredTones.length,
    used: filteredTones.length > 0 ? "filtered" : "fallback",
    toneIndex,
    tone
  });
  

  const data = group[tone];

  // =========================
  // 🎯 PICK CONTENT
  // =========================
  const greeting = pickRandom(data.greetings, seedGreet);
  const message = pickRandom(data.messages, seedMsg);

  logDebug("COMPOSE", "Content picked", {
    greeting,
    message
  });

  let reaction = null;

  if (tag && root.reaction?.[tag]?.[mode]) {
    const reactions = root.reaction[tag][mode];
    reaction = pickRandom(reactions, seedMsg);

    logDebug("COMPOSE", "Reaction picked", { reaction });
  }

  // =========================
  // 🧩 FINAL BUILD
  // =========================
  const parts = [];

  if (compose.includes("greeting")) parts.push(greeting);
  if (compose.includes("message")) parts.push(message);
  if (compose.includes("reaction") && reaction) parts.push(reaction);

  const final = parts.join("\n\n");

  logDebug("COMPOSE", "Final reply built", {
    parts,
    final
  });
  
  return {
    reply: final,
    meta: {
      greeting,
      message,
      tone,
      category: categoryName
    },
    debug: {
      compose,
      category: categoryName,
      tone,
      seedGreet,
      seedMsg
    }
  };
}