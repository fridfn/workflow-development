import { buildStoryLayer } from "./story.mapper.js";

export function buildEntry(entry = {}) {

  const normalizedEntry = {
    ...entry,

    source:
      entry.source || "engine",

    meta:
      entry.meta &&
      typeof entry.meta === "object"
        ? entry.meta
        : {},

    context:
      entry.context &&
      typeof entry.context === "object"
        ? entry.context
        : {},

    extra:
      entry.extra &&
      typeof entry.extra === "object"
        ? entry.extra
        : {},

    created_at:
      entry.created_at || Date.now()
  };

  return {
    ...normalizedEntry,

    story:
      buildStoryLayer(
        normalizedEntry
      )
  };
}