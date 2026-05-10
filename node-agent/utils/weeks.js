import { getDateSimulation } from "../utils/date.js";

export function getWeekOfMonth(date = getDateSimulation()) {
  return Math.ceil(
    date.getDate() / 7
  );
}