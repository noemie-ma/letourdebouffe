import { createMap } from "./map.js";
import { initUI } from "./ui.js";
import { loadTour } from "./tour.js";

window.addEventListener("DOMContentLoaded", async () => {
  createMap();
  initUI();
  await loadTour();
});
