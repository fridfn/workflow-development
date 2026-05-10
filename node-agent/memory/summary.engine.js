import fs from "fs";
import path from "path";
import { mergeStats } from "../utils/stats/merge.js";
import { getTopKey } from "../utils/stats/get.top.key.js";

export function generateMonthlySummary({
  statsDir,
  outputFile
}) {

  const files = fs
    .readdirSync(statsDir)
    .filter(file =>
      file.startsWith("week_") &&
      file.endsWith(".json")
    );

  const summary = {
    total_generated: 0,

    commit_stats: {},
    mode_stats: {},
    tone_stats: {},
    category_stats: {},
    tag_stats: {},
    reply_source_stats: {},
    active_hours: {}
  };

  // =========================
  // 🔹 MERGE ALL WEEKS
  // =========================
  for (const file of files) {

    const data = JSON.parse(
      fs.readFileSync(
        path.join(statsDir, file),
        "utf-8"
      )
    );
    
    mergeStats(summary, data);
  }

  // =========================
  // 🔹 CALCULATED FIELDS
  // =========================
  summary.top_commit_type =
    getTopKey(summary.commit_stats);

  summary.top_mode =
    getTopKey(summary.mode_stats);

  summary.top_tone =
    getTopKey(summary.tone_stats);

  summary.most_active_hour =
    getTopKey(summary.active_hours);

  summary.retry_ratio = {
    initial:
      summary.reply_source_stats
        ?.initial || 0,

    retry:
      summary.reply_source_stats
        ?.retry || 0
  };

  summary.generated_at =
    Date.now();

  // =========================
  // 🔹 SAVE
  // =========================
  fs.writeFileSync(
    outputFile,
    JSON.stringify(summary, null, 2),
    "utf-8"
  );
  
  return summary;
}