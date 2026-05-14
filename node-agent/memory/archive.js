import fs from "fs";
import { updateHighlights } from "./highlight.engine.js";
import { getWeekOfMonth } from "../utils/weeks.js";
import { updateWeeklyStats } from "./stats.engine.js"
import { getDateSimulation } from "../utils/date.js";
import { handleReflectionTransition } from "../engine/reflection.transition.engine.js";
import { buildEntry } from "../engine/enrichment/entry.builder.js";
import {
  ensureDir,
  ensureFiles
} from "../utils/fs.helper.js";

export async function archiveMemory({
  agent,
  result,
  context,
  stats,
  validation
}) {
  // =========================
  // 🔹 DATE INFO
  // =========================
  const now = getDateSimulation();
  const year = now.getFullYear();
  
  const day = String(
    now.getUTCDate()
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

  // =========================
  // 🔹 WEEK CALCULATION
  // =========================
  const weekNumber = getWeekOfMonth(now);
  
  const weekDir =
    `${baseDir}/${monthName}/weeks_${weekNumber}`;
    
  const statsDir =
  `./memory/stats/${agent}/${year}/${monthName}`;
  
  // stats memory file
  const statsFile =
  `${statsDir}/week_${weekNumber}.json`;
  
  // raw memory file
  const rawFile =
    `${weekDir}/${day}-${monthName}.json`;

  // optional future files
  // const highlightsFile =
  // `${weekDir}/highlights.json`;
    
  // const summaryFile =
  // `${weekDir}/summary.json`;

  const yearlySummaryFile =
    `./${baseDir}/yearly-summary.json`;
  
  // =========================
  // 🔹 AUTO CREATE & ENSURE FILES
  // =========================
  ensureDir(weekDir);
  ensureDir(statsDir);
  
  ensureFiles([
    {
      file: rawFile,
      fallback: []
    },
    // {
//       file: highlightsFile,
//       fallback: []
//     },
    // {
//       file: summaryFile,
//       fallback: {}
//     },
    {
      file: yearlySummaryFile,
      fallback: {}
    },
    {
      file: statsFile,
      fallback: {}
    }
  ]);

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
 // const entry = buildEntry(context, result);
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
context,
created_at: Date.now()
};

  archive.push(entry);

  // =========================
  // 🔹 SAVE RAW MEMORY
  // =========================
  fs.writeFileSync(
    rawFile,
    JSON.stringify(archive, null, 2),
    "utf-8"
  );
  
  // =========================
  // 🔹 GENERATE HIGHLIGHT
  // =========================
  // updateHighlights({
//     agent,
//     result,
//     context,
//     paths: {
//       highlightsFile
//     }
//   });
  
  // =========================
  // 🔹 GENERATE STATS
  // =========================
  updateWeeklyStats({
    statsFile,
    context,
    result,
    validation
  });
  
 //  await handleReflectionTransition({
//     agent
//   });
}