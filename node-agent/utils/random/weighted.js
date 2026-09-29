export function weightedRandom(weights) {
  if (!weights || typeof weights !== "object") {
    throw new TypeError("Weights must be an object.");
  }

  const entries = Object.entries(weights);

  if (entries.length === 0) {
    throw new Error("Weights cannot be empty.");
  }

  const total = entries.reduce((sum, [, weight]) => {
    if (typeof weight !== "number" || weight < 0) {
      throw new TypeError("Weight must be a non-negative number.");
    }

    return sum + weight;
  }, 0);

  if (total <= 0) {
    throw new Error("Total weight must be greater than 0.");
  }

  const roll = Math.floor(Math.random() * total);

  let accumulated = 0;

  for (const [key, weight] of entries) {
    accumulated += weight;

    if (roll < accumulated) {
      return key;
    }
  }

  throw new Error("Weighted selection failed.");
}
