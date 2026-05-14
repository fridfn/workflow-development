import { extractStorySignals } from "./extractor.js";

export function buildStoryLayer(entry) {
  const signals = extractStorySignals(entry);

  return {
    milestone: signals.milestone || signals.feature || null,
    intent: signals.intent || signals.action_type || null,
    problem: signals.problem || null,
    result: signals.result || null,
    impact: signals.impact || "low",
    status: signals.status || "unknown",

    summary_tags: Object.keys(signals)
  };
}