// Affichage de la carte Leaflet
const map = L.map("map").setView([46.2276, 2.2137], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Source des données
const URL_TOUR_HOMMES =
  "https://raw.githubusercontent.com/thomascamminady/LeTourDataSet/master/data/men/TDF_Stages_History.csv";
const URL_TOUR_FEMMES =
  "https://raw.githubusercontent.com/thomascamminady/LeTourDataSet/master/data/women/TDFF_Stages_History.csv";

let etapesHommes = [];
let etapesFemmes = [];
let genreSelectionne = "hommes";

// Chargement des données au démarrage
async function chargerDonneesHistoriques() {
  try {
    const [reponseHommes, reponseFemmes] = await Promise.all([
      fetch(URL_TOUR_HOMMES),
      fetch(URL_TOUR_FEMMES),
    ]);

    const texteHommes = await reponseHommes.text();
    const texteFemmes = await reponseFemmes.text();

    // Conversion du CSV en objets js
    const donneesBrutesHommes = Papa.parse(texteHommes, {
      header: true,
      skipEmptyLines: true,
    }).data;
    const donneesBrutesFemmes = Papa.parse(texteFemmes, {
      header: true,
      skipEmptyLines: true,
    }).data;

    // Filtrage des années 2000 à 2026
    etapesHommes = donneesBrutesHommes.filter(
      (e) => parseInt(e.Year || e.year) >= 2000,
    );
    etapesFemmes = donneesBrutesFemmes.filter(
      (e) => parseInt(e.Year || e.year) >= 2000,
    );

    console.log("Données chargées en mémoire avec succès !");

    initialiserMenuDeroulant();
    mettreAJourAffichage();
  } catch (erreur) {
    console.error("Erreur lors du chargement des données :", erreur);
  }
}

// Apparition des options du menu déroulant
function initialiserMenuDeroulant() {
  const select = document.getElementById("select-annee");
  for (let annee = 2026; annee >= 2000; annee--) {
    const option = document.createElement("option");
    option.value = annee;
    option.textContent = annee;
    select.appendChild(option);
  }
}

// Gestion du changement de compétition
function changerGenre(genre) {
  genreSelectionne = genre;

  document.getElementById("btn-hommes").style.backgroundColor =
    genre === "hommes" ? "#1abc9c" : "#34495e";
  document.getElementById("btn-femmes").style.backgroundColor =
    genre === "femmes" ? "#1abc9c" : "#34495e";

  mettreAJourAffichage();
}

// Filtrage et rendu des étapes
function mettreAJourAffichage() {
  const anneeCible = document.getElementById("select-annee").value;
  const listeEtapes =
    genreSelectionne === "hommes" ? etapesHommes : etapesFemmes;

  const etapesDeLAnnee = listeEtapes.filter(
    (e) => String(e.Year || e.year) === String(anneeCible),
  );

  const panneau = document.getElementById("details-panel");

  if (etapesDeLAnnee.length === 0) {
    panneau.innerHTML = `<h3>Aucune donnée</h3><p>Le Tour Femmes n'existait pas encore sous cette forme en ${anneeCible}.</p>`;
    return;
  }

  let htmlContenu = `<h3>📅 Édition ${anneeCible} (${genreSelectionne.toUpperCase()})</h3>`;
  htmlContenu += `<div style="max-height: 400px; overflow-y: auto; margin-top: 15px; padding-right: 5px;">`;

  etapesDeLAnnee.forEach((e) => {
    const numEtape = e.Stage || e.stage || "?";
    const depart = e.Origin || e.origin || "Inconnu";
    const arrivee = e.Destination || e.destination || "Inconnu";
    const distance = e.Distance || e.distance || "?";

    htmlContenu += `
            <div style="padding: 10px; border-bottom: 1px solid #eee; font-size: 0.9rem;">
                <b>Étape ${numEtape}</b> : ${depart} ➔ ${arrivee} <br>
                <small style="color: #7f8c8d;">📏 ${distance} km</small>
            </div>
        `;
  });

  htmlContenu += `</div>`;
  panneau.innerHTML = htmlContenu;
}

// Lancement de l'app
chargerDonneesHistoriques();
