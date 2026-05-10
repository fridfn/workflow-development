import path from "path";
import { generateMonthlySummary } from "../memory/summary.engine.js";
import {
  getMemory,
  setMemory
} from "../memory/memory.js";

export function handleMonthTransition({
  agent,
  currentMonth,
  currentYear,
  statsBaseDir
}) {

  const lastMonth =
    getMemory(
      agent,
      "system.last_month"
    );

  const lastYear =
    getMemory(
      agent,
      "system.last_year"
    );

  // first boot
  if (!lastMonth || !lastYear) {

    setMemory(
      agent,
      "system.last_month",
      currentMonth
    );

    setMemory(
      agent,
      "system.last_year",
      currentYear
    );

    return;
  }

  // =========================
  // 🔹 MONTH CHANGED
  // =========================
  const changed =
    lastMonth !== currentMonth ||
    lastYear !== currentYear;

  if (!changed) {
    return;
  }

  // =========================
  // 🔹 GENERATE SUMMARY
  // =========================
  const statsDir =
   path.join(
     statsBaseDir,
     agent,
     String(lastYear),
     lastMonth
   );
    
  const outputFile =
    path.join(
      statsDir,
      "summary.json"
    );

  generateMonthlySummary({
    statsDir,
    outputFile
  });

  // =========================
  // 🔹 UPDATE SYSTEM STATE
  // =========================
  setMemory(
    agent,
    "system.last_month",
    currentMonth
  );

  setMemory(
    agent,
    "system.last_year",
    currentYear
  );
}