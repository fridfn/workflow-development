import chalk from "chalk";

function getTime() {
  return new Date().toISOString().split("T")[1].split(".")[0];
}

function colorByLevel(level) {
  switch (level) {
    case "INFO":
      return chalk.cyan;
    case "WARN":
      return chalk.yellow;
    case "ERROR":
      return chalk.red;
    case "DEBUG":
      return chalk.gray;
    default:
      return chalk.white;
  }
}

function log(level, scope, message, data = null) {
  const time = getTime();

  const levelColor = colorByLevel(level);
  const scopeColor = chalk.magenta;

  let output =
    chalk.dim(`[${time}]`) +
    levelColor(`[${level}]`) +
    scopeColor(`[${scope}]`) +
    " " +
    message;

  if (data) {
    output += "\n" + chalk.dim(JSON.stringify(data, null, 2));
  }

  console.log(output);
}

// ===== BASIC =====
export const logInfo = (scope, msg, data) => log("INFO", scope, msg, data);
export const logWarn = (scope, msg, data) => log("WARN", scope, msg, data);
export const logError = (scope, msg, data) => log("ERROR", scope, msg, data);
export const logDebug = (scope, msg, data) => log("DEBUG", scope, msg, data);

// ===== SECTION =====
export function logSection(title) {
  const time = getTime();

  console.log("");
  console.log(chalk.blue(`[${time}][SECTION] =================================`));
  console.log(chalk.blueBright(`[${time}][SECTION] 🚀 ${title}`));
  console.log(chalk.blue(`[${time}][SECTION] =================================`));
}