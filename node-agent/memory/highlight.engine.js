import fs from "fs";
import { readJSON, writeJSON } from "../utils/fs.helper.js"

// =========================
// 🔹 SCORE ENGINE
// =========================
function calculateImportance({
  result,
  context
}) {
  let score = 0;

  const reply =
    result.reply?.toLowerCase() || "";

  const tone =
    result.meta?.tone || "";

  const category =
    result.meta?.category || "";

  const mode =
    context.mode || "";

  const commit =
    context.commit || {};

  // =========================
  // 🔹 COMMIT TYPE SCORE
  // =========================
  const commitTypeScore = {
    feat: 5,
    refactor: 4,
    fix: 3,
    docs: 2,
    style: 1,
    chore: 1,
    update: 1
  };

  score +=
    commitTypeScore[
      commit.type
    ] || 0;

  // =========================
  // 🔹 MODE SCORE
  // =========================
  const modeScore = {
    ambitious: 3,
    productive: 4,
    persistent: 5,
    consistent: 6,
    proactive: 2,
    warning: 1,
    last_warning: 1,
    final_warning: 0
  };

  score +=
    modeScore[mode] || 0;

  // =========================
  // 🔹 CATEGORY SCORE
  // =========================
  if (category === "support") {
    score += 2;
  }

  if (category === "reflection") {
    score += 3;
  }

  // =========================
  // 🔹 TONE SCORE
  // =========================
  if (
    tone.includes("soft")
  ) {
    score += 1;
  }

  if (
    tone.includes("focused")
  ) {
    score += 2;
  }

  if (
    tone.includes("maintain")
  ) {
    score += 1;
  }

  // =========================
  // 🔹 KEYWORD SCORE
  // =========================
  const keywords = [
    "konsisten",
    "tetap jalan",
    "tetap lanjut",
    "jalur",
    "fokus",
    "berkembang",
    "bangga",
    "percaya",
    "momentum",
    "gak nyerah"
  ];

  for (const keyword of keywords) {
    if (reply.includes(keyword)) {
      score += 2;
    }
  }

  // =========================
  // 🔹 LENGTH BONUS
  // =========================
  if (reply.length > 90) {
    score += 1;
  }

  if (reply.length > 140) {
    score += 1;
  }

  // =========================
  // 🔹 PENALTY
  // =========================
  if (
    mode.includes("warning")
  ) {
    score -= 2;
  }

  // =========================
  // 🔹 FINAL NORMALIZE
  // =========================
  if (score < 0) score = 0;
  if (score > 10) score = 10;

  return score;
}

// =========================
// 🔹 SAVE HIGHLIGHT
// =========================
export function saveHighlight({
  highlightsFile,
  result,
  context
}) {
  const highlights =
    readJSON(
      highlightsFile,
      []
    );

  const importance =
    calculateImportance({
      result,
      context
    });

  // =========================
  // 🔹 STRICT FILTER
  // =========================
  if (importance < 7) {
    return;
  }

  // =========================
  // 🔹 DUPLICATE CHECK
  // =========================
  const alreadyExists =
    highlights.some(
      (item) =>
        item.reply ===
        result.reply
    );

  if (alreadyExists) {
    return;
  }

  // =========================
  // 🔹 BUILD ENTRY
  // =========================
  const entry = {
    importance,

    reply: result.reply,

    mode:
      context.mode,

    tag:
      context.tag,

    tone:
      result.meta?.tone,

    category:
      result.meta?.category,

    commit:
      context.commit || null,

    created_at:
      Date.now()
  };

  // =========================
  // 🔹 INSERT + SORT
  // =========================
  highlights.unshift(entry);

  highlights.sort(
    (a, b) =>
      b.importance -
      a.importance
  );

  // =========================
  // 🔹 LIMIT
  // =========================
  const finalHighlights =
    highlights.slice(0, 50);

  writeJSON(
    highlightsFile,
    finalHighlights
  );
}

// =========================
// 🔹 MAIN HIGHLIGHT ENGINE
// =========================
export function updateHighlights({
  agent,
  result,
  context,
  paths
}) {
  const {
    highlightsFile
  } = paths;

  // =========================
  // 🔹 LOAD FILE
  // =========================
  const highlights =
    readJSON(highlightsFile, []);

  // =========================
  // 🔹 BUILD ENTRY
  // =========================
  const importance =
    calculateImportance({
      result,
      context
    });

  // skip kalau ga penting
  if (importance < 5) {
    return;
  }

  const entry = {
    importance,
    reply: result.reply,
    mode: context.mode,
    tag: context.tag,
    tone: result.meta?.tone,
    category:
      result.meta?.category,
    commit: context.commit || null,
    created_at: Date.now()
  };

  highlights.unshift(entry);

  // =========================
  // 🔹 SORT IMPORTANT FIRST
  // =========================
  highlights.sort(
    (a, b) =>
      b.importance - a.importance
  );

  // =========================
  // 🔹 LIMIT MEMORY
  // =========================
  const finalHighlights =
    highlights.slice(0, 50);

  // =========================
  // 🔹 SAVE
  // =========================
  writeJSON(
    highlightsFile,
    finalHighlights
  );
}