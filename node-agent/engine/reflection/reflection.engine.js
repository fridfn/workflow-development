export async function handleReflection(event) {
  console.log("\n[Reflection] Reflection event received");

  const { category, type } = event.event;

  console.log("Reflection :", `${category}.${type}`);

  /*
   * Phase berikutnya:
   *
   * daily
   * weekly
   * monthly
   * yearly
   *
   * akan diteruskan ke reflection system
   * yang sekarang sudah kamu punya.
   */

  return {
    status: "processed",

    eventId: event.id,

    reflection: {
      category,
      type,
    },
  };
}
