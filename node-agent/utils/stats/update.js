import {
  ensureTimelineStats
} from "./timeline.js";

import {
  updateFlatStats
} from "./flat.stats.js";

export function updateAgentStats({
  stats,
  context,
  result,
  validation
}) {

  updateFlatStats({
    stats,
    context,
    result,
    validation
  });

  return stats;
}