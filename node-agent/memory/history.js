import { getMemory, setMemory } from "./memory.js";

export function isInHistory(agent, path, value) {
  const history = getMemory(agent, path) || [];
  return history.includes(value);
}

export function pushHistory(agent, path, value, limit = 5) {
  let history = getMemory(agent, path) || [];

  history.unshift(value);

  if (history.length > limit) {
    history = history.slice(0, limit);
  }

  setMemory(agent, path, history);
}