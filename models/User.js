const mongoose = require('mongoose');

// ✅ Définition du schéma utilisateur
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true // Supprime les espaces inutiles
  },
  email: {
    type: String,
    required: true,
    unique: true, // Empêche la duplication des emails
    lowercase: true, // Convertit en minuscules
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Vérification du format email
  },
  password: {
    type: String,
    required: true,
    minlength: 6 // Longueur minimale du mot de passe
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'prestataire'], // Ajoute 'prestataire' si ce n'était pas déjà présent
    default: 'user' // Par défaut, utilisateur normal
  },
  favoris: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  }], // ✅ Ajout du champ favoris

  // 🪄 Champs pour le système de parrainage
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: String, // Code de parrainage utilisé lors de l’inscription
    default: null
  },
  referralsCount: {
    type: Number, // Nombre de personnes parrainées
    default: 0
  },
  referralRewards: {
    type: Number, // Crédits ou récompenses gagnés
    default: 0
  },

  // 🔐 Champs pour la double authentification (2FA)
  twoFactorCode: {
    type: String,
  },
  twoFactorExpires: {
    type: Date,
  }

}, { timestamps: true }); // ✅ Ajoute createdAt et updatedAt automatiquement

// ✅ Création du modèle utilisateur
const User = mongoose.model('User', UserSchema);

module.exports = User;

