// llm/parsers/json.parser.js

export function safeJSONParse(text) {

  try {
    return JSON.parse(text);
  }

  catch {

    return {
      error: true,
      raw: text
    };
  }
}