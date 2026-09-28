// engine/reflection.transition.js
import fs from "fs";
import path from "path";
import { getModel } from "../llm/models.js";
import { generateReflection } from "../llm/reflection.engine.js";
import { getDateSimulation } from "../utils/date.js";
import { getWeekOfMonth } from "../utils/weeks.js";

import { getMemory, setMemory } from "../memory/memory.js";

import { ensureDir, ensureFile } from "../utils/fs.helper.js";

// ========================================
// 🔹 MAIN
// ========================================
export async function handleReflectionTransition({ agent }) {
  0;
  const model = getModel("balanced");
  const now = getDateSimulation();

  const year = now.getFullYear();

  const month = now
    .toLocaleString("en-US", {
      month: "long",
    })
    .toLowerCase();

  const week = getWeekOfMonth(now);

  // ========================================
  // 🔹 LAST STATE
  // ========================================
  const lastDay = getMemory(agent, "reflection.last_day");

  const lastWeek = getMemory(agent, "reflection.last_week");

  const lastMonth = getMemory(agent, "reflection.last_month");

  const lastYear = getMemory(agent, "reflection.last_year");

  // ========================================
  // 🔹 REFLECTION SOURCE
  // ========================================

  const isMonthChanged = lastMonth !== month;

  const reflectionYear = isMonthChanged ? lastYear : year;

  const reflectionMonth = isMonthChanged ? lastMonth : month;

  // ========================================
  // 🔹 FIRST BOOT
  // ========================================
  if (!lastDay && !lastWeek && !lastMonth && !lastYear) {
    setMemory(agent, "reflection.last_day", now.getDate());

    setMemory(agent, "reflection.last_week", week);

    setMemory(agent, "reflection.last_month", month);

    setMemory(agent, "reflection.last_year", year);

    return;
  }

  // ========================================
  // 🔹 PATHS
  // ========================================

  const relativeDir = `${agent}/${year}/${month}`;

  const archiveMonthDir = `./activity/archive/${relativeDir}/journal`;

  const archiveMetadata = `./activity/archive/${relativeDir}/metadata`;

  const weeklyRelativeDir = `${agent}/${reflectionYear}/${reflectionMonth}`;

  const weeklyArchiveMetadata = `./activity/archive/${weeklyRelativeDir}/metadata`;

  const weeklyStatsMonthDir = `./activity/stats/${weeklyRelativeDir}/metadata`;

  // ========================================
  // 🔹 DAILY REFLECTION
  // ========================================
  const currentDay = String(now.getDate()).padStart(2, "0");

  if (lastDay !== currentDay) {
    const dailyDir = path.join(archiveMonthDir, "daily");

    ensureDir(dailyDir);

    const fileName = currentDay;

    const outputFile = path.join(dailyDir, `${fileName}.md`);

    const dailyData = loadDailyMemory({
      archiveMetadata,
      currentDay,
    });

    await generateReflection({
      agent,
      model,
      outputFile,
      type: "daily",
      data: dailyData,
    });

    setMemory(agent, "reflection.last_day", currentDay);
  }

  // ========================================
  // 🔹 WEEKLY REFLECTION
  // ============================ ============

  console.log("[WEEK CHECK]", {
    lastWeek,
    currentWeek: week,
    lastMonth,
    currentMonth: month,
  });

  if (lastWeek !== week) {
    console.log("[WEEKLY] RUNNING");
    console.log("[WEEKLY SOURCE]", {
      weeklyStatsMonthDir,
      weeklyArchiveMetadata,
      week: lastWeek,
    });

    const weeklyDir = path.join(
      "./activity/archive",
      weeklyRelativeDir,
      "journal",
      "weekly",
    );

    ensureDir(weeklyDir);

    const fileName = lastWeek;

    const outputFile = path.join(weeklyDir, `${fileName}.md`);

    const weeklyData = loadWeeklyStats({
      statsMonthDir: weeklyStatsMonthDir,
      archiveMetadata: weeklyArchiveMetadata,
      week: lastWeek,
    });

    await generateReflection({
      agent,
      type: "weekly",
      data: weeklyData,
      outputFile,
      model,
    });

    setMemory(agent, "reflection.last_week", week);
  }

  // ========================================
  // 🔹 MONTHLY REFLECTION
  // ========================================
  if (lastMonth !== month) {
    const lastMonthDir = `./activity/stats/${agent}/${lastYear}/${lastMonth}/metadata`;
    const monthlyData = loadMonthlyStats({
      lastMonthDir,
    });

    const outputFile = `./activity/archive/${agent}/${lastYear}/${lastMonth}/reflection.md`;

    await generateReflection({
      agent,
      model,
      outputFile,
      type: "monthly",
      data: monthlyData,
    });

    setMemory(agent, "reflection.last_month", month);
  }

  // ========================================
  // 🔹 YEARLY REFLECTION
  // ========================================
  if (lastYear !== year) {
    const yearlySummary = `./activity/stats/${agent}/${lastYear}/yearly-summary.json`;

    let yearlyData = {};

    if (fs.existsSync(yearlySummary)) {
      yearlyData = JSON.parse(fs.readFileSync(yearlySummary, "utf-8"));
    }

    await generateReflection({
      agent,
      type: "yearly",
      data: yearlyData,
      outputFile,
      model,
    });

    setMemory(agent, "reflection.last_year", year);
  }
}

// ========================================
// 🔹 LOAD DAILY MEMORY
// ========================================
function loadDailyMemory({ archiveMetadata, currentDay }) {
  const weeks = fs
    .readdirSync(archiveMetadata)
    .filter((dir) => dir.startsWith("week_"));

  const result = [];

  for (const week of weeks) {
    const weekDir = path.join(archiveMetadata, week);

    const files = fs
      .readdirSync(weekDir)
      .filter((file) => file.startsWith(String(currentDay).padStart(2, "0")));

    for (const file of files) {
      const filePath = path.join(weekDir, file);

      const data = JSON.parse(
        fs.readFileSync(path.join(weekDir, file), "utf-8"),
      );

      result.push(...data);
    }
  }

  return result;
}

// ========================================
// 🔹 LOAD WEEKLY STATS
// ========================================
function mergeStats(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "number") {
      target[key] = (target[key] ?? 0) + value;
      continue;
    }

    if (Array.isArray(value)) {
      target[key] = [...(target[key] ?? []), ...value];
      continue;
    }

    if (value && typeof value === "object") {
      target[key] ??= {};
      mergeStats(target[key], value);
    }
  }

  return target;
}

function loadWeeklyStats({ statsMonthDir, archiveMetadata, week }) {
  console.log("[WEEK KE]", week);

  const weekDir = path.join(statsMonthDir, `week_${week}`);

  ensureDir(weekDir);

  const files = fs
    .readdirSync(weekDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  const weeklyStats = {};
  const repositories = {};

  // ========================================
  // 🔹 LOAD WEEKLY STATS
  // ========================================

  for (const file of files) {
    const filePath = path.join(weekDir, file);

    try {
      const dailyStats = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      mergeStats(weeklyStats, dailyStats);
    } catch (error) {
      console.error(`[WEEK ERROR] ${file}:`, error.message);
    }
  }

  // ========================================
  // 🔹 LOAD REPOSITORY CONTEXT
  // ========================================

  const metadataWeekDir = path.join(archiveMetadata, `week_${week}`);

  ensureDir(metadataWeekDir);

  const metadataFiles = fs
    .readdirSync(metadataWeekDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  for (const file of metadataFiles) {
    const filePath = path.join(metadataWeekDir, file);

    try {
      const metadataData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

      for (const entry of metadataData) {
        buildRepositoryContext(repositories, entry);
      }
    } catch (error) {
      console.error(`[METADATA ERROR] ${file}:`, error.message);
    }
  }

  // ========================================
  // 🔹 SAVE MERGED WEEKLY DATA
  // ========================================

  const mergedDir = path.join(statsMonthDir, "merged");

  ensureDir(mergedDir);

  const mergedFile = path.join(mergedDir, `week_${week}.json`);

  const weeklyData = {
    stats: weeklyStats,
    repositories,
  };

  fs.writeFileSync(mergedFile, JSON.stringify(weeklyData, null, 2));
  console.log("[MERGED SAVED]", mergedFile);
  // ========================================
  // 🔹 RESULT
  // ========================================

  return weeklyData;
}

function buildRepositoryContext(repositories, entry) {
  const context = entry?.context;

  if (!context) {
    return;
  }

  const repository = context.repository;

  if (!repository) {
    return;
  }

  const repoKey = repository.full_name || context.repo;

  if (!repoKey) {
    return;
  }

  const hasCommit = context.activity?.hasCommit;

  if (!hasCommit) {
    return;
  }

  // ========================================
  // 🔹 INITIALIZE REPOSITORY
  // ========================================

  repositories[repoKey] ??= {
    repository: {
      name: repository.name,
      full_name: repository.full_name,
      description: repository.description,
      language: repository.language,
    },

    stats: {
      commits: 0,
      commit_types: {},
    },

    activities: [],
  };

  const repo = repositories[repoKey];

  // ========================================
  // 🔹 COMMIT STATS
  // ========================================

  repo.stats.commits++;

  const type = context.commit?.type || context.semantic?.type;

  if (type) {
    repo.stats.commit_types[type] = (repo.stats.commit_types[type] ?? 0) + 1;
  }

  // ========================================
  // 🔹 GIT ACTIVITY
  // ========================================

  repo.activities.push({
    time: context.commitTime,
    type: context.commit?.type || null,
    scope: context.commit?.scope || null,
    detail: context.commit?.detail || null,
  });
}

function loadMonthlyStats({ lastMonthDir }) {
  const mergedDir = path.join(lastMonthDir, "merged");

  if (!fs.existsSync(mergedDir)) {
    return {};
  }

  const files = fs
    .readdirSync(mergedDir)
    .filter(
      (file) =>
        file.startsWith("week_") &&
        file.endsWith(".json"),
    )
    .sort();

  const monthlyData = {};

  for (const file of files) {
    const filePath = path.join(mergedDir, file);

    try {
      const weeklyData = JSON.parse(
        fs.readFileSync(filePath, "utf-8"),
      );

      const weekName = path.basename(
        file,
        ".json",
      );

      // ========================================
      // 🔹 INITIALIZE WEEK
      // ========================================

      monthlyData[weekName] = {};

      // ========================================
      // 🔹 LOAD REPOSITORIES
      // ========================================

      for (const [repoKey, repoData] of Object.entries(
        weeklyData.repositories ?? {},
      )) {
        const repositoryName =
          repoData.repository?.name || repoKey;

        monthlyData[weekName][repositoryName] = {
          commits: repoData.stats?.commits ?? 0,

          types: {
            ...(repoData.stats?.commit_types ?? {}),
          },

          activities: (repoData.activities ?? [])
            .map((activity) => activity.detail)
            .filter(Boolean),
        };
      }
    } catch (error) {
      console.error(
        `[MONTH ERROR] ${file}:`,
        error.message,
      );
    }
  }

  // ========================================
  // 🔹 SAVE MONTHLY RECAP
  // ========================================

  const mergedFile = path.join(
    mergedDir,
    "monthly_recap.json",
  );

  fs.writeFileSync(
    mergedFile,
    JSON.stringify(monthlyData, null, 2),
  );

  return monthlyData;
}