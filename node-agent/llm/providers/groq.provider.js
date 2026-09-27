import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ========================================
// 🔹 SLEEP
// ========================================

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// ========================================
// 🔹 GET HEADER
// ========================================

function getHeader(headers, name) {
  if (!headers) return null;

  if (typeof headers.get === "function") {
    return headers.get(name);
  }

  return headers[name] ?? headers[name.toLowerCase()] ?? null;
}

// ========================================
// 🔹 PARSE RESET TIME
// ========================================

function parseResetTime(value) {
  if (!value) return null;

  const text = String(value).trim();

  // contoh:
  // "7.66s"
  // "1m2.5s"
  // "2m"
  let milliseconds = 0;

  const minutes = text.match(/([\d.]+)m/);
  const seconds = text.match(/([\d.]+)s/);

  if (minutes) {
    milliseconds += Number(minutes[1]) * 60_000;
  }

  if (seconds) {
    milliseconds += Number(seconds[1]) * 1_000;
  }

  if (milliseconds > 0) {
    return milliseconds;
  }

  return null;
}

// ========================================
// 🔹 RATE LIMIT WAIT
// ========================================

async function waitForRateLimit(error) {
  const headers = error?.headers;

  const retryAfter = getHeader(headers, "retry-after");

  const resetTokens = getHeader(headers, "x-ratelimit-reset-tokens");

  const retryAfterMs = retryAfter ? Number(retryAfter) * 1000 : null;

  const resetTokensMs = parseResetTime(resetTokens);

  // Pakai informasi paling spesifik dari Groq
  const waitMs = retryAfterMs ?? resetTokensMs ?? 65_000;

  // sedikit buffer supaya tidak langsung
  // nabrak batas lagi
  const delay = waitMs + 1_000;

  console.log(
    `[GROQ] Rate limit reached. ` + `Waiting ${Math.ceil(delay / 1000)}s...`,
  );

  await sleep(delay);
}

// ========================================
// 🔹 GENERATE
// ========================================

export async function generateGroq({
  model,
  messages,
  temperature = 0.7,
  max_tokens = 2000,
}) {
  const maxRetries = 3;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens,
      });

      console.log("[FINISH REASON]", completion.choices[0].finish_reason);

      console.log("[USAGE]", completion.usage);

      return completion.choices?.[0]?.message?.content;
    } catch (error) {
      const status = error?.status;

      const code = error?.error?.error?.code;

      const isRateLimit =
        status === 429 || (status === 413 && code === "rate_limit_exceeded");

      const isServerError = status >= 500;

      const retryable = isRateLimit || isServerError;

      if (!retryable || attempt === maxRetries) {
        throw error;
      }

      // ========================================
      // 🔹 RATE LIMIT
      // ========================================

      if (isRateLimit) {
        await waitForRateLimit(error);
        continue;
      }

      // ========================================
      // 🔹 SERVER ERROR
      // ========================================

      const delay = 5_000 * 2 ** attempt;

      console.log(
        `[GROQ] Server error (${status}). ` +
          `Retry ${attempt + 1}/${maxRetries} ` +
          `in ${delay / 1000}s...`,
      );

      await sleep(delay);
    }
  }
}
