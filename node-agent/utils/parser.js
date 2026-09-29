export function parseCommit(msg) {
  let detail = msg;

  const parser = (msg) => {
    if (!msg.includes(":")) return null;

    const match = msg.match(/^(\w+)\(([^)]+)\):\s(.+)$/);

    if (!match) return null;

    let [, type, scope, message] = match;

    return {
      type: type.trim(),
      scope: scope.trim(),
      message: message.trim(),
    };
  };

  const parsed = parser(msg) ?? {};

  const {
    type = "update",
    scope = "default",
    message = "commit update",
  } = parsed;

  let actionTag = "update";

  // Prioritaskan scope
  if (scope.startsWith("feat")) actionTag = "feat";
  else if (scope.startsWith("fix")) actionTag = "fix";
  else if (scope.startsWith("refactor")) actionTag = "refactor";
  else if (scope.startsWith("chore")) actionTag = "chore";
  else if (scope.startsWith("docs")) actionTag = "docs";
  else if (scope.startsWith("style")) actionTag = "style";
  else if (scope.startsWith("test")) actionTag = "test";
  // Kalau scope bukan action tag, baru lihat type
  else if (type.startsWith("feat")) actionTag = "feat";
  else if (type.startsWith("fix")) actionTag = "fix";
  else if (type.startsWith("refactor")) actionTag = "refactor";
  else if (type.startsWith("chore")) actionTag = "chore";
  else if (type.startsWith("docs")) actionTag = "docs";
  else if (type.startsWith("style")) actionTag = "style";
  else if (type.startsWith("test")) actionTag = "test";

  return {
    type,
    scope,
    detail,
    actionTag,
  };
}
