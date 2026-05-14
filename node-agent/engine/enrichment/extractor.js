export function extractStorySignals(entry) {
  const signals = {};

  for (const key in entry.context || {}) {
    signals[key] = entry.context[key];
  }

  for (const key in entry.extra || {}) {
    signals[key] = entry.extra[key];
  }

  for (const key in entry.meta || {}) {
    signals[key] = entry.meta[key];
  }

  return signals;
}