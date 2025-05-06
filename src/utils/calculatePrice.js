// Grille tarifaire (par m²)
const pricingTable = {
  standard: {
    propre: 1.59,
    sale: 2.29,
    tres_sale: 2.79,
  },
  renovation: {
    propre: 2.79,
    sale: 3.29,
    tres_sale: 3.79,
  },
  luxe: {
    propre: 3.79,
    sale: 4.29,
    tres_sale: 4.79,
  },
};

// Majoration (par m² ou fixes)
const MAJORATIONS = {
  animaux: 0.5,
  urgence: 0.5,
  week_end: 0.5,
  repassage: 0.5,
  vitres: 0.5,
  tapis: 0.5,
};

export function calculatePrice({ surface, typeService, niveauSale, options = {} }) {
  if (!surface || !typeService || !niveauSale) return null;

  // 1. Tarif de base
  const baseRate = pricingTable[typeService]?.[niveauSale] || 1.59;

  // 2. Majoration cumulée
  let majoration = 0;
  Object.keys(options).forEach((opt) => {
    if (options[opt]) {
      majoration += MAJORATIONS[opt] || 0;
    }
  });

  const pricePerM2 = baseRate + majoration;
  const total = (surface * pricePerM2).toFixed(2);

  // 3. Répartition
  const provider = (total * 0.8).toFixed(2);
  const platform = (total * 0.2).toFixed(2);

  return {
    pricePerM2: pricePerM2.toFixed(2),
    total: parseFloat(total),
    provider: parseFloat(provider),
    platform: parseFloat(platform),
  };
}

