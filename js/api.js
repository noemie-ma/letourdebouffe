// APIs pour les Tours Hommes et Femmes
const URL_TOUR_HOMMES =
  "https://raw.githubusercontent.com/thomascamminady/LeTourDataSet/master/data/men/TDF_Stages_History.csv";
const URL_TOUR_FEMMES =
  "https://raw.githubusercontent.com/thomascamminady/LeTourDataSet/master/data/women/TDFF_Stages_History.csv";

export async function chargerDonneesCSV() {
  try {
    const [reponseHommes, reponseFemmes] = await Promise.all([
      fetch(URL_TOUR_HOMMES),
      fetch(URL_TOUR_FEMMES),
    ]);

    const texteHommes = await reponseHommes.text();
    const texteFemmes = await reponseFemmes.text();

    const hommes = Papa.parse(texteHommes, {
      header: true,
      skipEmptyLines: true,
    }).data;
    const femmes = Papa.parse(texteFemmes, {
      header: true,
      skipEmptyLines: true,
    }).data;

    return { hommes, femmes };
  } catch (erreur) {
    console.error(
      "Erreur lors du chargement des jeux de données CSV :",
      erreur,
    );
    return { hommes: [], femmes: [] };
  }
}
