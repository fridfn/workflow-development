import fetch from "node-fetch";

import { logInfo, logWarn, logError, logDebug, logSection } from "./logger.js";

import { getRepoMeta } from "./github.repo.js";

export async function hasCommitToday({ username, token }) {
  logSection("GitHub Commit Checker");

  logInfo("github", `Checking commits for user: ${username}`);

  const url = `https://api.github.com/users/${username}/events`;

  logDebug("github", `Request URL: ${url}`);

  let res;

  try {
    logInfo("github", "Sending request to GitHub API...");

    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
  } catch (err) {
    logError("github", "Network error while fetching GitHub API", {
      message: err.message,
    });

    return {
      hasCommit: false,
      reason: "network_error",
    };
  }

  logDebug("github", `Response status: ${res.status}`);

  if (!res.ok) {
    logError("github", "GitHub API returned error", {
      status: res.status,
      statusText: res.statusText,
    });

    return {
      hasCommit: false,
      reason: "github_api_error",
    };
  }

  logInfo("github", "Response OK, parsing events...");

  const events = await res.json();

  logDebug("github", `Total events fetched: ${events.length}`);

  const now = new Date();

  const jakartaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  logInfo("github", `Today's date (WIB / Jakarta): ${jakartaDate}`);

  const pushEvents = events.filter((event) => event.type === "PushEvent");

  logDebug("github", `PushEvents found: ${pushEvents.length}`);

  if (pushEvents.length === 0) {
    logWarn("github", "No PushEvent found in recent activity");

    return {
      hasCommit: false,
      reason: "no_push_event",
    };
  }

  for (const event of pushEvents) {
    const eventDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(event.created_at));

    logDebug("github", "Checking PushEvent", {
      repo: event.repo?.name,
      eventDate,
      todayDate: jakartaDate,
      match: eventDate === jakartaDate,
    });

    if (eventDate !== jakartaDate) {
      continue;
    }

    logInfo("github", "✅ Commit found today!", {
      repo: event.repo?.name,
      pushedAt: event.created_at,
    });

    const repoMetadata = await getRepoMeta({
      repoFullName: event.repo?.name,
      token,
    });

    return {
      hasCommit: true,

      repo: event.repo?.name,

      commitTime: event.created_at,

      repoMetadata,
    };
  }

  logWarn("github", "❌ No commits found for today");

  return {
    hasCommit: false,
    reason: "no_commit_today",
  };
}
