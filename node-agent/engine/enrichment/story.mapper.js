import {
  extractStorySignals
} from "./extractor.js";

function buildSummary(signals) {
  return Object.entries(signals)
    .filter(([_, value]) =>
      value !== null &&
      value !== undefined
    )
    .map(([key, value]) => ({
      key,
      value
    }));
}

function generateTags(signals) {
  return Object.keys(signals)
    .map(key =>
      key.split(".").pop()
    );
}

export function buildStoryLayer(entry) {
  const signals =
    extractStorySignals(entry);

  return {
    signals,

    summary:
      buildSummary(signals),

    tags:
      generateTags(signals),

    timeline: {
      timestamp:
        entry.created_at,

      source:
        entry.source
    }
  };
}