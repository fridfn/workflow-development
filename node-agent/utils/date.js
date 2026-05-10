export function getDateSimulation() {
  // =========================
  // 🔹 SIMULATION MODE
  // =========================
  
  return process.env.FAKE_DATE
    ? new Date(process.env.FAKE_DATE)
    : new Date();
}