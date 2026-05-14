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
  
  const { type = "update", scope = "default", message = "commit update" } = parser(msg);
  
  let reaction = "update";

  if (type.startsWith("feat"))
    reaction = "feat"

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