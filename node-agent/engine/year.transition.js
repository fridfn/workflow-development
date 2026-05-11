import path from "path";

import {
  generateYearlySummary
} from "./yearly.summary.engine.js";

import {
  generateYearlyReflection
} from "./yearly.reflection.engine.js";

import {
  getMemory,
  setMemory
} from "../memory/memory.js";

export function handleYearTransition({
  agent,
  currentYear
}) {

  const lastYear =
    getMemory(
      agent,
      "system.last_year"
    );

  // =========================
  // 🔹 FIRST BOOT
  // =========================
  if (!lastYear) {

    setMemory(
      agent,
      "system.last_year",
      currentYear
    );

    return;
  }

  // =========================
  // 🔹 YEAR CHANGED
  // =========================
  const changed =
    Number(lastYear)
    !== Number(currentYear);

  if (!changed) {
    return;
  }

  // =========================
  // 🔹 STATS YEARLY SUMMARY
  // =========================
  const statsYearDir =
    path.join(
      "./memory/stats",
      agent,
      String(lastYear)
    );

  const statsOutputFile =
    path.join(
      statsYearDir,
      "yearly-summary.json"
    );

  generateYearlySummary({
    yearDir: statsYearDir,
    outputFile:
      statsOutputFile
  });

  // =========================
  // 🔹 ARCHIVE YEARLY REFLECTION
  // =========================
  const archiveYearDir =
    path.join(
      "./memory/archive",
      agent,
      String(lastYear)
    );

  const archiveOutputFile =
    path.join(
      archiveYearDir,
      "yearly-summary.json"
    );

  generateYearlyReflection({
    yearDir:
      archiveYearDir,

    outputFile:
      archiveOutputFile
  });

  // =========================
  // 🔹 UPDATE SYSTEM STATE
  // =========================
  setMemory(
    agent,
    "system.last_year",
    currentYear
  );
}