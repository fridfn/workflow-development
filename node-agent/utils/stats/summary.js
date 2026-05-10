import { mergeStats } from "./merge.js";
import { getMonthKey } from "./timeline.js";
import { getDateSimulation } from "../date.js";

export function generateMonthSummary(
  stats,
  date = getDateSimulation()
) {

  const year =
    date.getFullYear();

  const month =
    getMonthKey(date);

  const monthData =
    stats?.[year]?.[month];

  if (!monthData) {
    return stats;
  }

  const summary = {};

  for (const weekData of Object.values(
    monthData.weeks
  )) {

    mergeStats(
      summary,
      weekData
    );
  }

  monthData.summary =
    summary;

  return stats;
}