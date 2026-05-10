import fs from "fs";
import path from "path";

export function archiveMemory({
  agent,
  result,
  context,
  stats
}) {
  const now = new Date();

  // =========================
  // 🔹 DATE INFO
  // =========================
  const year = now.getFullYear();

  const monthNumber = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const monthName = now
    .toLocaleString("en-US", {
      month: "long"
    })
    .toLowerCase();

  // =========================
  // 🔹 DIRECTORY STRUCTURE
  // =========================
  const baseDir =
    `./memory/archive/${agent}/${year}`;

  const monthDir =
    `${baseDir}/${monthName}`;

  // raw memory file
  const rawFile =
    `${monthDir}/${monthNumber}-${monthName}.json`;

  // optional future files
  const highlightsFile =
    `${monthDir}/highlights.json`;

  const summaryFile =
    `${monthDir}/summary.json`;

  const yearlySummaryFile =
    `${baseDir}/yearly-summary.json`;

  // =========================
  // 🔹 ENSURE DIR
  // =========================
  fs.mkdirSync(monthDir, {
    recursive: true
  });

  // =========================
  // 🔹 LOAD RAW ARCHIVE
  // =========================
  let archive = [];

  if (fs.existsSync(rawFile)) {
    archive = JSON.parse(
      fs.readFileSync(rawFile)
    );
  }

  // =========================
  // 🔹 BUILD ENTRY
  // =========================
  const entry = {
    source:
      context.source || "engine",

    reply: result.reply,

    meta: {
      greeting:
        result.meta?.greeting,

      message:
        result.meta?.message,

      tone:
        result.meta?.tone,

      category:
        result.meta?.category
    },

    context: {
      mode: context.mode,
      tag: context.tag
    },

    extra: {
      commit:
        context.commit || null
    },

    created_at: Date.now()
  };

  archive.push(entry);

  // =========================
  // 🔹 SAVE RAW MEMORY
  // =========================
  fs.writeFileSync(
    rawFile,
    JSON.stringify(archive, null, 2)
  );

  // =========================
  // 🔹 AUTO CREATE FILES
  // =========================
  if (!fs.existsSync(highlightsFile)) {
    fs.writeFileSync(
      highlightsFile,
      JSON.stringify([], null, 2)
    );
  }

  if (!fs.existsSync(summaryFile)) {
    fs.writeFileSync(
      summaryFile,
      JSON.stringify({}, null, 2)
    );
  }

  if (!fs.existsSync(yearlySummaryFile)) {
    fs.writeFileSync(
      yearlySummaryFile,
      JSON.stringify({}, null, 2)
    );
  }
}