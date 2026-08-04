let map;
let groupeTraces;
let groupeMarqueurs;

export function createMap() {
  map = L.map("map").setView([46.8, 2.3], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  groupeTraces = L.layerGroup().addTo(map);
  groupeMarqueurs = L.layerGroup().addTo(map);
}

export function getMap() {
  return map;
}

export function reinitialiserCalques() {
  if (groupeTraces) groupeTraces.clearLayers();
  if (groupeMarqueurs) groupeMarqueurs.clearLayers();
}

export function getGroupeTraces() {
  return groupeTraces;
}

export function getGroupeMarqueurs() {
  return groupeMarqueurs;
}
