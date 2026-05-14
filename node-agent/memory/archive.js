import fs from "fs";
import { getWeekOfMonth } from "../utils/weeks.js";
import { updateWeeklyStats } from "./stats.engine.js"
import { getDateSimulation } from "../utils/date.js";
import { handleReflectionTransition } from "../engine/reflection.transition.engine.js";
import {
  ensureDir,
  ensureFiles
} from "../utils/fs.helper.js";

export async function archiveMemory({
  source,
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
  const archiveDir =
  `./memory/archive/${agent}`;
  
  // =========================
  // 🔹 WEEK CALCULATION
  // =========================
  const weekNumber =
    getWeekOfMonth(now);
  
  const archivePath =
    `${year}/${monthName}/week_${weekNumber}`;
  
  // =========================
  // 🔹 FULL PATHS
  // =========================
  const rawDir =
    `${archiveDir}/${archivePath}`;
  
  const statsDir =
    `./memory/stats/${agent}/${archivePath}`;
  
  // stats memory file
  const statsFile =
    `${statsDir}/${day}.json`;
  
  // raw memory file
  const rawFile =
    `${rawDir}/${day}.json`;
  
  const yearlySummaryFile =
    `${archiveDir}/${year}/summaries/yearly-summary.json`;
  
  // =========================
  // 🔹 ENSURE DIRS
  // =========================
  ensureDir(rawDir);
  ensureDir(statsDir);
  ensureDir(`${archiveDir}/${year}/summaries/`);
  
  ensureFiles([
    {
      file: rawFile,
      fallback: []
    },
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
 const entry = {
source: source || "engine",
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
  // 🔹 GENERATE STATS
  // =========================
  updateWeeklyStats({
    statsFile,
    context,
    result,
    validation
  });
  
  await handleReflectionTransition({
    agent
  });
}