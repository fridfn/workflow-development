export function parseCommit(msg) {

  let type = "update";
  let detail = msg;

  if (msg.includes(":")) {

    const [t, ...rest] = msg.split(":");

    type = t.trim();
    detail = rest.join(":").trim();
  }

  let reaction = "update";

  if (type.startsWith("feat"))
    reaction = "feat";

  else if (type.startsWith("fix"))
    reaction = "fix";

  else if (type.startsWith("refactor"))
    reaction = "refactor";

  else if (type.startsWith("chore"))
    reaction = "chore";

  else if (type.startsWith("docs"))
    reaction = "docs";

  else if (type.startsWith("style"))
    reaction = "style";

  else if (type.startsWith("test"))
    reaction = "test";

  return {
    type,
    detail,
    reaction
  };
}