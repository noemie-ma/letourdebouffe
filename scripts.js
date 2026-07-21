const map = L.map("map").setView([46.2276, 2.2137], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const URL_TOUR_HOMMES =
  "https://raw.githubusercontent.com/thomascamminady/LeTourDataSet/master/data/men/TDF_Stages_History.csv";
const URL_TOUR_FEMMES =
  "https://raw.githubusercontent.com/thomascamminady/LeTourDataSet/master/data/women/TDFF_Stages_History.csv";

let etapesHommes = [];
let etapesFemmes = [];

async function chargerDonneesHistoriques() {
  try {
    console.log("Téléchargement des données du Tour en cours...");

    const [reponseHommes, reponseFemmes] = await Promise.all([
      fetch(URL_TOUR_HOMMES),
      fetch(URL_TOUR_FEMMES),
    ]);

    const texteHommes = await reponseHommes.text();
    const texteFemmes = await reponseFemmes.text();

    const donneesBrutesHommes = Papa.parse(texteHommes, {
      header: true,
      skipEmptyLines: true,
    }).data;
    const donneesBrutesFemmes = Papa.parse(texteFemmes, {
      header: true,
      skipEmptyLines: true,
    }).data;

    etapesHommes = donneesBrutesHommes.filter((etape) => {
      const annee = parseInt(etape.Year || etape.year);
      return annee >= 2000 && annee <= 2026;
    });

    etapesFemmes = donneesBrutesFemmes.filter((etape) => {
      const annee = parseInt(etape.Year || etape.year);
      return annee >= 2000 && annee <= 2026;
    });

    console.log(
      `✅ Chargement réussi ! ${etapesHommes.length} étapes Hommes et ${etapesFemmes.length} étapes Femmes trouvées depuis 2000.`,
    );

    if (etapesHommes.length > 0) {
      console.log("Exemple d'une étape structurée :", etapesHommes[0]);
    }

    intialiserInterface();
  } catch (erreur) {
    console.error(
      "Erreur critique lors de la récupération des données :",
      erreur,
    );
  }
}

function intialiserInterface() {
  const panneau = document.getElementById("details-panel");
  panneau.innerHTML = `
        <h3>📊 Base de données connectée</h3>
        <p style="margin-top: 10px;">Les données depuis l'an 2000 ont été téléchargées avec succès.</p>
        <ul style="margin-top: 10px; padding-left: 20px;">
            <li>Étapes Hommes : ${etapesHommes.length}</li>
            <li>Étapes Femmes : ${etapesFemmes.length}</li>
        </ul>
        <p style="margin-top: 10px; color: #7f8c8d; font-size: 0.85rem;">Ouvrez la console de votre navigateur (F12) pour voir les objets de données complets !</p>
    `;
}

chargerDonneesHistoriques();
const map = L.map("map").setView([46.16, -1.15], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

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

let listeMarqueurs = [];

function afficherPoints(categorieFiltre) {
  listeMarqueurs.forEach((marker) => map.removeLayer(marker));
  listeMarqueurs = [];

  pointsInteret.forEach((point) => {
    if (categorieFiltre === "tous" || point.type === categorieFiltre) {
      const marker = L.marker(point.coords).addTo(map);

      marker.bindPopup(`<b>${point.nom}</b>`);

      marker.on("click", () => {
        const panneau = document.getElementById("details-panel");
        panneau.innerHTML = `
                    <h3>${point.nom}</h3>
                    <p style="margin-top: 10px; color: #7f8c8d;"><i>Type : ${point.type === "terroir" ? "🧀 Producteur Local" : "📍 Spot Spectateurs / Vélo"}</i></p>
                    <p style="margin-top: 10px; line-height: 1.4;">${point.description}</p>
                `;
      });

      listeMarqueurs.push(marker);
    }
  });
}

function filtrerPoints(categorie) {
  afficherPoints(categorie);
}

afficherPoints("tous");
