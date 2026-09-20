import { getDateSimulation } from "../utils/date.js";

export function getWeekOfMonth(date = getDateSimulation()) {
  return String(Math.ceil(date.getDate() / 7)).padStart(2, "0");
}
