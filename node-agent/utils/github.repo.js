import fetch from "node-fetch";
import { logInfo, logError, logDebug } from "./logger.js";

export async function getRepoMeta({ repoFullName, token }) {
  // repoFullName format: "username/repo-name"

  if (!repoFullName) return null;

  const url = `https://api.github.com/repos/${repoFullName}`;

  logInfo("github", `Fetching repo metadata: ${repoFullName}`);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });

    if (!res.ok) {
      logError("github", "Failed to fetch repo metadata", {
        status: res.status,
        repo: repoFullName
      });
      return null;
    }

    const data = await res.json();

    return {
      name: data.name,
      full_name: data.full_name,
      description: data.description,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      topics: data.topics,
      visibility: data.visibility,
      created_at: data.created_at,
      updated_at: data.updated_at
    };

  } catch (err) {
    logError("github", "Network error repo metadata", {
      message: err.message
    });
    return null;
  }
}