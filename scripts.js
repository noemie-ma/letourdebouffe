// 1. Initialisation de la carte (Centrée par défaut près de La Rochelle)
const map = L.map("map").setView([46.16, -1.15], 11);

// 2. Chargement des tuiles de la carte (OpenStreetMap)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// 3. Notre base de données locale (Données fictives de démonstration)
const pointsInteret = [
  {
    id: 1,
    nom: "La Chèvre Rit - Fromagerie",
    type: "terroir",
    coords: [46.18, -1.05],
    description:
      "Découvrez notre élevage local et dégustez nos fromages de chèvre artisanaux directement à la ferme, située sur le tracé de la rando vélo.",
  },
  {
    id: 2,
    nom: "Le Sommet du Panorama",
    type: "spectateur",
    coords: [46.12, -1.2],
    description:
      "Lieu idéal en hauteur pour voir passer le peloton à pleine vitesse avec une vue imprenable. Pensez à venir 2h avant le passage !",
  },
  {
    id: 3,
    nom: "Cycles Rapi-Dépannage",
    type: "spectateur",
    coords: [46.15, -1.13],
    description:
      "Atelier solidaire de réparation de vélo. Idéal en cas de pépin sur la route ou pour regonfler vos pneus avant l'étape.",
  },
];

// Tableau pour stocker les marqueurs affichés à l'écran
let listeMarqueurs = [];

// 4. Fonction pour afficher les marqueurs sur la carte
function afficherPoints(categorieFiltre) {
  // Supprimer les marqueurs existants pour nettoyer la carte
  listeMarqueurs.forEach((marker) => map.removeLayer(marker));
  listeMarqueurs = [];

  // Filtrer et ajouter les marqueurs correspondants
  pointsInteret.forEach((point) => {
    if (categorieFiltre === "tous" || point.type === categorieFiltre) {
      // Créer le marqueur Leaflet
      const marker = L.marker(point.coords).addTo(map);

      // Ajouter une bulle d'info simple au survol ou clic sur le marqueur
      marker.bindPopup(`<b>${point.nom}</b>`);

      // Événement au clic : mettre à jour le panneau latéral gauche
      marker.on("click", () => {
        const panneau = document.getElementById("details-panel");
        panneau.innerHTML = `
                    <h3>${point.nom}</h3>
                    <p style="margin-top: 10px; color: #7f8c8d;"><i>Type : ${point.type === "terroir" ? "🧀 Producteur Local" : "📍 Spot Spectateurs / Vélo"}</i></p>
                    <p style="margin-top: 10px; line-height: 1.4;">${point.description}</p>
                `;
      });

      // Conserver une trace du marqueur pour pouvoir le supprimer au prochain filtre
      listeMarqueurs.push(marker);
    }
  });
}

// 5. Fonction globale pour filtrer (appelée par les boutons HTML)
function filtrerPoints(categorie) {
  afficherPoints(categorie);
}

// Initialisation : afficher tous les points au premier chargement de la page
afficherPoints("tous");
