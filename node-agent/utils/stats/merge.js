export function mergeStats(
  target,
  source
) {

  for (const key in source) {

    const value = source[key];

    // number
    if (
      typeof value ===
      "number"
    ) {

      target[key] =
        (target[key] || 0)
        + value;
    }

    // object
    else if (
      typeof value ===
        "object" &&
      value !== null
    ) {

      if (!target[key]) {
        target[key] = {};
      }

      mergeStats(
        target[key],
        value
      );
    }
  }

  return target;
}