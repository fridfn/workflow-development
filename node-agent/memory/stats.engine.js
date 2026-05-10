import fs from "fs";
import { updateAgentStats } from "../utils/stats/update.js";

export function updateWeeklyStats({
  statsFile,
  context,
  result,
  validation
}) {
  let stats = {};
  
  if (fs.existsSync(statsFile)) {
    stats = JSON.parse(
      fs.readFileSync(
       statsFile,
       "utf-8"
      )
    );
  }
  
  updateAgentStats({
    stats,
    context,
    result,
    validation
  });

  fs.writeFileSync(
    statsFile,
    JSON.stringify(stats, null, 2),
    "utf-8"
  );
  
  return stats;
}