import { getDateSimulation } from "../utils/date.js";

export function getJakartaHour() {
  const now = getDateSimulation();
  
  const jakartaTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    hour12: false
  }).format(now);
  
  return parseInt(jakartaTime, 10);
}

export function resolveDailyMode({ hasCommit }) {
  const hour = getJakartaHour();

  let mode = null;
  let shouldSend = true; // default commit selalu send
  let skip = false;
  let source = hasCommit ? "commit" : "no_commit"

  if (hasCommit) {
    // =========================
    // ✅ COMMIT MODE
    // =========================
    if (hour >= 12 && hour < 16) {
      mode = "ambitious";

    } else if (hour >= 16 && hour < 18) {
      mode = "productive";

    } else if (hour >= 18 && hour < 21) {
      mode = "persistent";

    } else if (hour >= 21 || hour < 7) {
      mode = "consistent";

    } else {
      mode = "proactive";
    }

  } else {
    // =========================
    // ❌ NO COMMIT MODE
    // =========================
    shouldSend = false;

    if (hour >= 12 && hour < 19) {
      mode = "warning";
      shouldSend = Math.random() < 0.25;

    } else if (hour >= 19 && hour < 23) {
      mode = "last_warning";
      shouldSend = Math.random() < 0.33;

    } else if (hour >= 23 || hour < 7) {
      mode = "final_warning";
      shouldSend = Math.random() < 0.5;
    }

    if (hour < 12) {
      skip = true;
    }
  }

  return {
    mode,
    shouldSend,
    skip,
    hour,
    source
  };
}