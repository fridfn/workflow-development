export function createActionIntent({ type, payload = {} }) {
  return {
    type,
    payload,
  };
}
