export function buildConversationPrompt({ conversationContext }) {
  return `
Current conversation:
${JSON.stringify(conversationContext.current, null, 2)}

Relevant short-term memory:
${JSON.stringify(conversationContext.memory.shortTerm, null, 2)}
`;
}
