import { incrementStat } from "./increment.js";
import { ensureStatGroup } from "./groups.js";
import { getDateSimulation } from "../date.js";

export function updateFlatStats({
  stats,
  context,
  result,
  validation
}) {

  const type =
    context.commit?.type
    || "unknown";

  const mode =
    context.mode
    || "unknown";

  const tone =
    result.meta?.tone
    || "unknown";

  const category =
    result.meta?.category
    || "unknown";

  const tag =
    context.tag
    || "unknown";

  const source =
    validation.isValid
      ? "initial"
      : "retry";
  
  const date = getDateSimulation()
  const hour =
    date.getHours();

  // groups
  const commitStats =
    ensureStatGroup(
      stats,
      "commit_stats"
    );

  const modeStats =
    ensureStatGroup(
      stats,
      "mode_stats"
    );

  const toneStats =
    ensureStatGroup(
      stats,
      "tone_stats"
    );

  const categoryStats =
    ensureStatGroup(
      stats,
      "category_stats"
    );

  const tagStats =
    ensureStatGroup(
      stats,
      "tag_stats"
    );

  const sourceStats =
    ensureStatGroup(
      stats,
      "reply_source_stats"
    );

  const activeHours =
    ensureStatGroup(
      stats,
      "active_hours"
    );

  // increment
  incrementStat(
    stats,
    "total_generated"
  );

  incrementStat(
    commitStats,
    type
  );

  incrementStat(
    modeStats,
    mode
  );

  incrementStat(
    toneStats,
    tone
  );

  incrementStat(
    categoryStats,
    category
  );

  incrementStat(
    tagStats,
    tag
  );

  incrementStat(
    sourceStats,
    source
  );

  incrementStat(
    activeHours,
    hour
  );

  stats.last_generated_at =
    Date.now();

  return stats;
}