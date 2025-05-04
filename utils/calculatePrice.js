// 🔁 Fonction pour recharger la grille à chaud
function getPricingData() {
  delete require.cache[require.resolve("../config/pricingTable")];
  return require("../config/pricingTable");
}

// ✅ Fonction de calcul du prix total
function calculatePrice({
  surface,
  typeService = "standard",
  niveauSale = "modere", // défaut = modéré
  options = {},
}) {
  if (!surface || surface <= 0) return null;

  const { pricingTable, MAJORATIONS } = getPricingData();

  // 1. Base selon type de service et niveau de saleté
  const baseRate = pricingTable[typeService]?.[niveauSale] || 1.59;

  // 2. Majoration selon options
  let majoration = 0;
  Object.keys(options).forEach((key) => {
    if (options[key]) {
      majoration += MAJORATIONS[key] || 0;
    }
  });

  const pricePerM2 = baseRate + majoration;

  // 3. Calcul des montants
  const total = (surface * pricePerM2).toFixed(2);
  const partPrestataire = (total * 0.8).toFixed(2);
  const partPlateforme = (total * 0.2).toFixed(2);

  // 4. Durée estimée
  const estimatedDuration = Math.ceil(surface / 20); // 1h par 20m²

  return {
    pricePerM2: pricePerM2.toFixed(2),
    total: parseFloat(total),
    provider: parseFloat(partPrestataire),
    platform: parseFloat(partPlateforme),
    duration: estimatedDuration,
  };
}

// ✅ Export
module.exports = calculatePrice;

