const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  date: { type: Date, required: true },
  service: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['en attente', 'attribuée', 'en cours', 'terminée', 'annulée'], default: 'en attente' },
  categorie: {
    type: String,
    enum: [
      'Nettoyage maison',
      'Nettoyage appartement',
      'Repassage',
      'Vitres',
      'Ménage complet',
      'Désinfection',
      'Nettoyage extérieur voiture',
      'Nettoyage intérieur voiture',
      'Nettoyage tapis',
      'Nettoyage bureaux',
      'Nettoyage industriel',
      'Nettoyage après déménagement',
      'Nettoyage après travaux',
      'Nettoyage d’événements',
      'Nettoyage espaces verts',
      'Entretien piscine',
      'Dépoussiérage mobilier',
      'Lessive et linge',
      'Entretien parties communes'
    ],
    required: true
  },
  price: { type: Number, required: true },
  discountApplied: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);

