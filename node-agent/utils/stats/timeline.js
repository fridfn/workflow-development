import { getDateSimulation } from "../date.js";

export function getMonthKey(
  date = getDateSimulation()
) {

  return date
    .toLocaleString("en-US", {
      month: "long"
    })
    .toLowerCase();
}

export function getWeekKey(
  date = getDateSimulation()
) {

  const day = date.getDate();

  const week =
    Math.ceil(day / 7);

  return `weeks_${week}`;
}

export function ensureTimelineStats(
  stats,
  date = getDateSimulation()
) {

  const year =
    date.getFullYear();

  const month =
    getMonthKey(date);

  const week =
    getWeekKey(date);

  if (!stats[year]) {
    stats[year] = {};
  }

  if (!stats[year][month]) {
    stats[year][month] = {
      weeks: {},
      summary: {}
    };
  }

  if (
    !stats[year][month]
      .weeks[week]
  ) {

    stats[year][month]
      .weeks[week] = {};
  }

  return {
    year,
    month,
    week,
    current:
      stats[year][month]
        .weeks[week]
  };
}