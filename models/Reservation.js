const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
  },
  date: {
    type: String, // Date + heure combinées simplifiées
    required: true,
  },
  heure: {
    type: String,
    required: true,
  },
  adresse: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },

  validationPin: {
    type: String,
  },

  paid: {
    type: Boolean,
    default: false,
  },

  status: {
    type: String,
    enum: [
      'draft',
      'pending',
      'confirmed',
      'cancelled',
      'en attente',
      'attribuée',
      'en cours',
      'terminée',
      'annulée',
      'refused',
      'en_attente_prestataire',
      'en_attente_estimation',
    ],
    default: 'draft',
  },

  categorie: {
    type: String,
    required: true,
  },

  surface: {
    type: Number,
  },

  niveauSalete: {
    type: String,
    enum: ['faible', 'modere', 'important', 'critique', 'sale'], // ✅ Ajout temporaire pour Stripe
  },

  options: {
    type: Object,
    default: {},
  },

  photos: {
    type: [String],
    default: [],
  },

  prixTotal: {
    type: Number,
  },
  partPrestataire: {
    type: Number,
  },
  partPlateforme: {
    type: Number,
  },

  discountApplied: {
    type: Boolean,
    default: false,
  },

  reprogrammed: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);

