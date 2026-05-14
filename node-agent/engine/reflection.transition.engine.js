// engine/reflection.transition.js
import fs from "fs";
import path from "path";
import { getModel } from "../llm/models.js"
import { generateReflection } from "../llm/reflection.engine.js";
import { getDateSimulation } from "../utils/date.js";
import { getWeekOfMonth } from "../utils/weeks.js";

import {
  getMemory,
  setMemory
} from "../memory/memory.js";

import {
  ensureDir,
  ensureFiles
} from "../utils/fs.helper.js";

// ========================================
// 🔹 MAIN
// ========================================
export async function handleReflectionTransition({
  agent
}) {
  const model = getModel("instant")
  const now =
    getDateSimulation();

  const year =
    now.getFullYear();

  const month =
    now.toLocaleString(
      "en-US",
      {
        month: "long"
      }
    ).toLowerCase();

  const week =
    getWeekOfMonth(now);

  // ========================================
  // 🔹 LAST STATE
  // ========================================
  const lastDay =
    getMemory(
      agent,
      "reflection.last_day"
    );

  const lastWeek =
    getMemory(
      agent,
      "reflection.last_week"
    );

  const lastMonth =
    getMemory(
      agent,
      "reflection.last_month"
    );

  const lastYear =
    getMemory(
      agent,
      "reflection.last_year"
    );

  // ========================================
  // 🔹 FIRST BOOT
  // ========================================
  if (
    !lastDay &&
    !lastWeek &&
    !lastMonth &&
    !lastYear
  ) {

    setMemory(
      agent,
      "reflection.last_day",
      now.getDate()
    );

    setMemory(
      agent,
      "reflection.last_week",
      week
    );

    setMemory(
      agent,
      "reflection.last_month",
      month
    );

    setMemory(
      agent,
      "reflection.last_year",
      year
    );

    return;
  }

  // ========================================
  // 🔹 PATHS
  // ========================================
  const archiveMonthDir =
    `./memory/archive/${agent}/${year}/${month}`;

  const statsMonthDir =
    `./memory/stats/${agent}/${year}/${month}`;

  // ========================================
  // 🔹 DAILY REFLECTION
  // ========================================
  const currentDay =
    now.getUTCDate();
    
  if (lastDay !== currentDay) {

    const dailyDir =
      path.join(
        archiveMonthDir,
        "daily"
      );
      
      ensureDir(dailyDir);
      
    const dayName =
      now.toLocaleString(
        "en-US",
        {
          weekday: "long"
        }
      ).toLowerCase();

    const fileName =
      `${dayName}-${currentDay}.json`;

    const outputFile =
      path.join(
        dailyDir,
        fileName
      );

    const dailyData =
      loadDailyMemory({
        archiveMonthDir,
        currentDay
      });

    await generateReflection({
      agent,
      type: "daily",
      data: dailyData,
      outputFile,
      model
    });

    setMemory(
      agent,
      "reflection.last_day",
      currentDay
    );
  }

  // ========================================
  // 🔹 WEEKLY REFLECTION
  // ========================================
  if (lastWeek !== week) {

    const outputFile =
      path.join(
        archiveMonthDir,
        "weekly",
        `week_${lastWeek}.json`
      );

    ensureDir(path.dirname(outputFile));

    const weeklyData =
      loadWeeklyStats({
        statsMonthDir,
        week: lastWeek
      });

    await generateReflection({
      agent,
      type: "weekly",
      data: weeklyData,
      outputFile,
      model
    });

    setMemory(
      agent,
      "reflection.last_week",
      week
    );
  }

  // ========================================
  // 🔹 MONTHLY REFLECTION
  // ========================================
  if (lastMonth !== month) {

    const previousMonthDir =
      `./memory/stats/${agent}/${year}/${lastMonth}`;

    const summaryFile =
      path.join(
        previousMonthDir,
        "summary.json"
      );
     
    ensureDir(summaryFile);
     
    let monthlyData = {};

    if (
      fs.existsSync(summaryFile)
    ) {

      monthlyData =
        JSON.parse(
          fs.readFileSync(
            summaryFile,
            "utf-8"
          )
        );
    }

    const outputFile =
      `./memory/archive/${agent}/${year}/${lastMonth}/reflection.json`;

    await generateReflection({
      agent,
      type: "monthly",
      data: monthlyData,
      outputFile,
      model
    });

    setMemory(
      agent,
      "reflection.last_month",
      month
    );
  }

  // ========================================
  // 🔹 YEARLY REFLECTION
  // ========================================
  if (lastYear !== year) {

    const yearlySummary =
      `./memory/stats/${agent}/${lastYear}/yearly-summary.json`;

    let yearlyData = {};

    if (
      fs.existsSync(yearlySummary)
    ) {

      yearlyData =
        JSON.parse(
          fs.readFileSync(
            yearlySummary,
            "utf-8"
          )
        );
    }

    const outputFile =
      `./memory/archive/${agent}/${lastYear}/yearly-reflection.json`;

    await generateReflection({
      agent,
      type: "yearly",
      data: yearlyData,
      outputFile,
      model
    });

    setMemory(
      agent,
      "reflection.last_year",
      year
    );
  }
}

// ========================================
// 🔹 LOAD DAILY MEMORY
// ========================================
function loadDailyMemory({
  archiveMonthDir,
  currentDay
}) {

  const weeks = fs
    .readdirSync(
      archiveMonthDir
    )
    .filter(dir =>
      dir.startsWith("weeks_")
    );

  const result = [];

  for (const week of weeks) {

    const weekDir =
      path.join(
        archiveMonthDir,
        week
      );

    const files = fs
      .readdirSync(weekDir)
      .filter(file =>
        file.startsWith(
          String(currentDay)
            .padStart(2, "0")
        )
      );

    for (const file of files) {

      const data =
        JSON.parse(
          fs.readFileSync(
            path.join(
              weekDir,
              file
            ),
            "utf-8"
          )
        );

      result.push(...data);
    }
  }

  return result;
}

// ========================================
// 🔹 LOAD WEEKLY STATS
// ========================================
function loadWeeklyStats({
  statsMonthDir,
  week
}) {

  const file =
    path.join(
      statsMonthDir,
      `week_${week}.json`
    );

  if (!fs.existsSync(file)) {
    return {};
  }

  return JSON.parse(
    fs.readFileSync(
      file,
      "utf-8"
    )
  );
}