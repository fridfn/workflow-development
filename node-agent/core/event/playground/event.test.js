import { createEvent } from "../event.contract.js";
import { handleEvent } from "../event.handler.js";
import { registerEventHandlers } from "../event.router.js";

async function handleTestEvent(event) {
  console.log("\n✅ TEST HANDLER BERHASIL");

  console.log("Event ID :", event.id);
  console.log(
    "Event    :",
    `${event.event.category}.${event.event.type}`
  );
  console.log("Payload  :", event.payload);

  return {
    status: "processed",
    eventId: event.id
  };
}

registerEventHandlers({
  "test.message": handleTestEvent
});

const event = createEvent({
  source: {
    type: "test",
    id: "manual-test"
  },

  event: {
    category: "test",
    type: "message"
  },

  actor: {
    id: "farid",
    name: "Farid"
  },

  context: {},

  payload: {
    message: "Hello from Event System!"
  },

  metadata: {
    test: true
  }
});

const result = await handleEvent(event);

console.log("\n📦 RESULT");
console.log(result);