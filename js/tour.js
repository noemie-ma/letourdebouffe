import { chargerDonneesCSV } from "./api.js";
import {
  getMap,
  reinitialiserCalques,
  getGroupeTraces,
  getGroupeMarqueurs,
} from "./map.js";

let etapesHommes = [];
let etapesFemmes = [];
let genreSelectionne = "hommes";
const cacheGeocodage = {};

const DONNEES_TERROIR = {
  Nord: [
    {
      nom: "Maroilles AOP",
      type: "🧀 Spécialité",
      desc: "Le fromage fort du Nord.",
    },
    {
      nom: "Estaminet Flamand",
      type: "🍷 Bar / Resto",
      desc: "Carbonnade et bières locales.",
    },
  ],
  DEFAUT: [
    {
      nom: "Marché du Terroir",
      type: "🧺 Produit Local",
      desc: "Découverte des spécialités régionales.",
    },
    {
      nom: "Ferme Artisanale",
      type: "🌾 Élevage / Culture",
      desc: "Vente directe de produits frais.",
    },
  ],
};

function extraireValeur(objet, synonymes) {
  if (!objet) return null;
  const clesObjet = Object.keys(objet);
  for (let syn of synonymes) {
    const synNettoye = syn.toLowerCase().replace(/[^a-z0-9]/g, "");
    const cleTrouvee = clesObjet.find((c) => {
      const cNettoye = c.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cNettoye.includes(synNettoye) || synNettoye.includes(cNettoye);
    });
    if (
      cleTrouvee &&
      objet[cleTrouvee] !== undefined &&
      objet[cleTrouvee] !== null &&
      objet[cleTrouvee] !== ""
    ) {
      return String(objet[cleTrouvee]).trim();
    }
  }
  return null;
}

export async function loadTour() {
  const donnees = await chargerDonneesCSV();
  etapesHommes = donnees.hommes;
  etapesFemmes = donnees.femmes;

  initialiserInterfaceMenu();
  afficherEtapes();
}

function initialiserInterfaceMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;

  menu.innerHTML = `
    <div style="margin-bottom: 15px;">
      <label for="select-annee" style="font-weight: bold; display: block; margin-bottom: 5px; font-size: 0.85rem;">CHOISIR UNE ANNÉE :</label>
      <select id="select-annee" style="width: 100%; padding: 8px; border-radius: 5px; background: #222; color: white; border: 1px solid #444; cursor: pointer;">
      </select>
    </div>

    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
      <button id="btn-hommes" style="flex: 1; padding: 8px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; background: #FFD100; color: #111;">🚴 Tour Hommes</button>
      <button id="btn-femmes" style="flex: 1; padding: 8px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; background: #444; color: white;">🚴‍♀️ Tour Femmes</button>
    </div>

    <div id="liste-etapes-conteneur"></div>
  `;

  const select = document.getElementById("select-annee");
  for (let annee = 2026; annee >= 2000; annee--) {
    const opt = document.createElement("option");
    opt.value = annee;
    opt.textContent = annee;
    select.appendChild(opt);
  }

  select.addEventListener("change", () => afficherEtapes());
  document
    .getElementById("btn-hommes")
    .addEventListener("click", () => changerGenre("hommes"));
  document
    .getElementById("btn-femmes")
    .addEventListener("click", () => changerGenre("femmes"));
}

function changerGenre(genre) {
  genreSelectionne = genre;
  const btnH = document.getElementById("btn-hommes");
  const btnF = document.getElementById("btn-femmes");

  if (genre === "hommes") {
    btnH.style.backgroundColor = "#FFD100";
    btnH.style.color = "#111111";
    btnF.style.backgroundColor = "#444444";
    btnF.style.color = "#ffffff";
  } else {
    btnF.style.backgroundColor = "#FFD100";
    btnF.style.color = "#111111";
    btnH.style.backgroundColor = "#444444";
    btnH.style.color = "#ffffff";
  }

  afficherEtapes();
}

function afficherEtapes() {
  const anneeCible = document.getElementById("select-annee").value;
  const conteneur = document.getElementById("liste-etapes-conteneur");
  const listeBase = genreSelectionne === "hommes" ? etapesHommes : etapesFemmes;

  const etapesDeLAnnee = listeBase.filter((e) => {
    const annee = extraireValeur(e, ["year", "annee"]);
    return String(annee) === String(anneeCible);
  });

  if (etapesDeLAnnee.length === 0) {
    conteneur.innerHTML = `<p style="color: #aaa; font-size: 0.9rem;">⚠️ Aucune donnée disponible pour l'édition ${anneeCible}.</p>`;
    return;
  }

  let html = `<h3 style="margin-bottom: 12px; font-size: 1rem;">📅 Édition ${anneeCible}</h3>`;
  html += `<div style="max-height: 380px; overflow-y: auto; padding-right: 5px;">`;

  etapesDeLAnnee.forEach((e, index) => {
    const numEtape =
      extraireValeur(e, ["stage", "num", "number", "etape"]) || index + 1;
    const depart =
      extraireValeur(e, ["start", "origin", "depart", "from"]) || "Inconnu";
    const arrivee =
      extraireValeur(e, [
        "destination",
        "finish",
        "arrival",
        "end",
        "arrivee",
        "to",
      ]) || "Inconnu";
    const distance = extraireValeur(e, ["distance", "length", "km", "kms"]);
    const distTxt =
      distance && distance !== "?" ? `${distance} km` : "Calcul en cours...";

    html += `
      <div class="stage-card" 
           data-depart="${depart}" 
           data-arrivee="${arrivee}" 
           style="padding: 10px; background: #222; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #FFD100; font-size: 0.88rem; cursor: pointer; transition: background 0.2s;">
        <strong>Étape ${numEtape}</strong> : ${depart} ➔ <span style="color:#e67e22; font-weight:bold;">${arrivee}</span><br>
        <small style="color:#aaa;">📏 ${distTxt}</small>
      </div>
    `;
  });

  html += `</div>`;
  conteneur.innerHTML = html;

  document.querySelectorAll(".stage-card").forEach((carte) => {
    carte.addEventListener("click", () => {
      const depart = carte.getAttribute("data-depart");
      const arrivee = carte.getAttribute("data-arrivee");
      tracerEtape(depart, arrivee);
    });
  });
}

async function geocoderVille(nomVille) {
  if (!nomVille || nomVille === "Inconnu") return null;
  if (cacheGeocodage[nomVille]) return cacheGeocodage[nomVille];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nomVille + ", France")}`,
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      cacheGeocodage[nomVille] = coords;
      return coords;
    }
  } catch (err) {
    console.error("Erreur de géocodage :", err);
  }
  return null;
}

async function tracerEtape(depart, arrivee) {
  reinitialiserCalques();

  const coordsDepart = await geocoderVille(depart);
  const coordsArrivee = await geocoderVille(arrivee);

  if (!coordsDepart || !coordsArrivee) {
    alert(
      `Impossible de géolocaliser les villes de l'étape : ${depart} -> ${arrivee}`,
    );
    return;
  }

  const map = getMap();
  const groupeTraces = getGroupeTraces();
  const groupeMarqueurs = getGroupeMarqueurs();

  try {
    const urlOSRM = `https://router.project-osrm.org/route/v1/driving/${coordsDepart.lng},${coordsDepart.lat};${coordsArrivee.lng},${coordsArrivee.lat}?overview=full&geometries=geojson`;
    const res = await fetch(urlOSRM);
    const data = await res.json();

    let pointsRoute = [];

    if (data.routes && data.routes.length > 0) {
      const routeCoords = data.routes[0].geometry.coordinates.map((c) => [
        c[1],
        c[0],
      ]);
      const polyline = L.polyline(routeCoords, {
        color: "#e67e22",
        weight: 5,
        opacity: 0.85,
      }).addTo(groupeTraces);
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      pointsRoute = routeCoords.map((c) => L.latLng(c[0], c[1]));
    } else {
      const polyline = L.polyline([coordsDepart, coordsArrivee], {
        color: "#95a5a6",
        weight: 4,
        dashArray: "5, 5",
      }).addTo(groupeTraces);
      map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
      pointsRoute = [
        L.latLng(coordsDepart.lat, coordsDepart.lng),
        L.latLng(coordsArrivee.lat, coordsArrivee.lng),
      ];
    }

    L.circleMarker(coordsDepart, {
      radius: 7,
      color: "#2ecc71",
      fillColor: "#2ecc71",
      fillOpacity: 1,
    })
      .bindPopup(`🛫 <b>Départ</b> : ${depart}`)
      .addTo(groupeMarqueurs);

    L.circleMarker(coordsArrivee, {
      radius: 7,
      color: "#e74c3c",
      fillColor: "#e74c3c",
      fillOpacity: 1,
    })
      .bindPopup(`🛬 <b>Arrivée</b> : ${arrivee}`)
      .addTo(groupeMarqueurs);

    const terroir = DONNEES_TERROIR["DEFAUT"];
    terroir.forEach((poi, index) => {
      const fraction = (index + 1) / (terroir.length + 1);
      const indexPt = Math.floor(fraction * (pointsRoute.length - 1));
      const pt = pointsRoute[indexPt];

      if (pt) {
        L.marker([pt.lat, pt.lng])
          .bindPopup(`<b>${poi.type} - ${poi.nom}</b><br>${poi.desc}`)
          .addTo(groupeMarqueurs);
      }
    });
  } catch (err) {
    console.error("Erreur lors du calcul de la route :", err);
  }
}
