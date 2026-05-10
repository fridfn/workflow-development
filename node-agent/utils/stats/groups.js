export function ensureStatGroup(
  stats,
  group
) {

  if (!stats[group]) {
    stats[group] = {};
  }

  return stats[group];
}