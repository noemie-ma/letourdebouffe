let map;

export function createMap() {
  map = L.map("map").setView([46.8, 2.3], 6);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {
      attribution: "© OpenStreetMap",
    },
  ).addTo(map);
}

export function getMap() {
  return map;
}
