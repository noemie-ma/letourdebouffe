export function initUI() {
  console.log("UI prête");

  const menu = document.getElementById("menu");
  if (menu) {
    menu.innerHTML = `
      <h2>Éditions du Tour</h2>
      <p>Sélectionnez une étape dans le menu pour afficher son parcours et ses produits locaux.</p>
    `;
  }
}
