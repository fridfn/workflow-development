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
  
  let actionTag = "update";

  if (type.startsWith("feat"))
    actionTag = "feat"

  else if (type.startsWith("fix"))
    actionTag = "fix";

  else if (type.startsWith("refactor"))
    actionTag = "refactor";

  else if (type.startsWith("chore"))
    actionTag = "chore";

  else if (type.startsWith("docs"))
    actionTag = "docs";

  else if (type.startsWith("style"))
    actionTag = "style";

  else if (type.startsWith("test"))
    actionTag = "test";

  return {
    type,
    scope,
    detail,
    actionTag
  };
}