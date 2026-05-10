export function incrementStat(target, key, amount = 1) {
  if (!target[key]) {
    target[key] = 0;
  }

  target[key] += amount;
}

export function ensureStatGroup(stats, group) {
  if (!stats[group]) {
    stats[group] = {};
  }

  return stats[group];
}

export function updateAgentStats({
  stats,
  context,
  result,
  validation
}) {
  const type =
    context.commit?.type || "unknown";

  const mode =
    context.mode || "unknown";

  const tone =
    result.meta?.tone || "unknown";

  const category =
    result.meta?.category || "unknown";

  const tag =
    context.tag || "unknown";

  const source =
    validation.isValid
      ? "initial"
      : "retry";

  const hour =
    new Date().getHours();

  // =========================
  // 🔹 ENSURE GROUPS
  // =========================
  const commitStats =
    ensureStatGroup(stats, "commit_stats");

  const modeStats =
    ensureStatGroup(stats, "mode_stats");

  const toneStats =
    ensureStatGroup(stats, "tone_stats");

  const categoryStats =
    ensureStatGroup(stats, "category_stats");

  const tagStats =
    ensureStatGroup(stats, "tag_stats");

  const sourceStats =
    ensureStatGroup(stats, "reply_source_stats");

  const activeHours =
    ensureStatGroup(stats, "active_hours");

  // =========================
  // 🔹 INCREMENT
  // =========================
  incrementStat(stats, "total_generated");

  incrementStat(commitStats, type);
  incrementStat(modeStats, mode);
  incrementStat(toneStats, tone);
  incrementStat(categoryStats, category);
  incrementStat(tagStats, tag);
  incrementStat(sourceStats, source);
  incrementStat(activeHours, hour);

  // =========================
  // 🔹 META
  // =========================
  stats.last_generated_at = Date.now();

  return stats;
}