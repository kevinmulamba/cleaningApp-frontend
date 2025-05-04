const pricingTable = {
  standard: {
    faible: 1.59,
    modéré: 2.29,
    important: 2.79,
    critique: 3.29,
  },
  renovation: {
    faible: 2.29,
    modéré: 2.79,
    important: 3.29,
    critique: 3.79,
  },
  luxe: {
    faible: 2.79,
    modéré: 3.29,
    important: 4.29,
    critique: 4.79,
  },
};

const MAJORATIONS = {
  urgence: 0.5,
  week_end: 0.5,
  animaux: 0.5,
  repassage: 0.5,
  vitres: 0.5,
  tapis: 0.5,
};

module.exports = { pricingTable, MAJORATIONS };

