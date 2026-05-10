export function incrementStat(
  target,
  key,
  amount = 1
) {

  if (!target[key]) {
    target[key] = 0;
  }

  target[key] += amount;
}