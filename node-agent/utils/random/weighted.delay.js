export function weightedDelay(minDelay, maxDelay) {
  if (typeof minDelay !== "number" || typeof maxDelay !== "number") {
    throw new TypeError("Delay values must be numbers.");
  }

  if (minDelay < 0 || maxDelay < 0) {
    throw new RangeError("Delay values cannot be negative.");
  }

  if (maxDelay < minDelay) {
    throw new RangeError("maxDelay must be greater than or equal to minDelay.");
  }

  const range = maxDelay - minDelay;
  const roll = Math.floor(Math.random() * 100);

  let result;

  if (roll < 60) {
    // MID
    const base = minDelay + Math.floor(range / 2);
    const variation = Math.floor(range / 4) + 1;
    const offset = Math.floor(Math.random() * variation);

    result = base + offset;
  } else if (roll < 80) {
    // FAST
    const variation = Math.floor(range / 3) + 1;
    const offset = Math.floor(Math.random() * variation);

    result = minDelay + offset;
  } else {
    // SLOW
    const variation = Math.floor(range / 3) + 1;
    const offset = Math.floor(Math.random() * variation);

    result = maxDelay - offset;
  }

  return result;
}
