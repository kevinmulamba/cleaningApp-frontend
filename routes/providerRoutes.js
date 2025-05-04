const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDistanceMatrix = require("../utils/googleMaps");
const authMiddleware = require("../middlewares/authMiddleware");
const Provider = require("../models/Provider");
const PremiumSubscription = require("../models/PremiumSubscription");
const Reservation = require('../models/Reservation');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// ✅ Route pour inscrire un prestataire
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, phone, speciality, availability, location } = req.body;

        // Vérifier si l'email existe déjà
        const existingProvider = await Provider.findOne({ email });
        if (existingProvider) {
            return res.status(400).json({ message: "❌ Email déjà utilisé" });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer le prestataire
        const newProvider = new Provider({
            name,
            email,
            password: hashedPassword,
            phone,
            speciality,
            availability,
            location,
        });

        await newProvider.save();
        res.status(201).json({ message: "✅ Prestataire inscrit avec succès !", provider: newProvider });

    } catch (error) {
        console.error("🔥 Erreur serveur:", error);
        res.status(500).json({ message: "❌ Erreur serveur", error });
    }
});

// ✅ Route pour mise à jour de la position du prestataire
router.post("/update-location", async (req, res) => {
  try {
    const { providerId, lat, lng } = req.body;

    if (!providerId || lat == null || lng == null) {
      return res.status(400).json({ message: "Données manquantes" });
    }

    const updated = await Provider.findByIdAndUpdate(
      providerId,
      {
        location: {
          type: "Point",
          coordinates: [lng, lat]
        },
        lastUpdated: Date.now()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Prestataire introuvable" });
    }

    res.json({
      message: "📍 Position mise à jour avec succès",
      location: updated.location
    });

  } catch (error) {
    console.error("❌ Erreur update-location :", error.message);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// ✅ Route pour récupérer la position actuelle d’un prestataire
router.get('/:id/location', async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id); // ✅ ici
    const provider = await Provider.findById(id);

    if (
      !provider ||
      !provider.location ||
      !provider.location.coordinates ||
      provider.location.coordinates.length !== 2
    ) {
      return res.status(404).json({ message: "❌ Prestataire ou position introuvable" });
    }

    const [lng, lat] = provider.location.coordinates;

    res.status(200).json({
      location: { lat, lng },
      providerName: provider.name,
    });
  } catch (error) {
    console.error("❌ Erreur récupération position :", error.message);
    res.status(500).json({ message: "❌ Erreur serveur", error: error.message });
  }
});

// ✅ Route pour mettre à jour la disponibilité d'un prestataire
router.patch("/availability", authMiddleware, async (req, res) => {
    try {
        const { availability } = req.body;
        const provider = await Provider.findByIdAndUpdate(
            req.user.id,
            { availability },
            { new: true }
        );

        if (!provider) {
            return res.status(404).json({ message: "❌ Prestataire non trouvé" });
        }

        res.json({ message: "✅ Disponibilité mise à jour", provider });

    } catch (error) {
        console.error("🔥 Erreur serveur:", error);
        res.status(500).json({ message: "❌ Erreur serveur", error });
    }
});

// ✅ Route pour récupérer tous les prestataires
router.get("/", async (req, res) => {
    try {
        const providers = await Provider.find();
        res.json({ message: "✅ Prestataires récupérés", providers });

    } catch (error) {
        console.error("🔥 Erreur serveur:", error);
        res.status(500).json({ message: "❌ Erreur serveur", error });
    }
});

// ✅ Route pour récupérer les prestataires disponibles avec leur localisation
router.get("/available", async (req, res) => {
    try {
        const providers = await Provider.find({ available: true }).select("name location");
        res.json({ message: "✅ Prestataires disponibles récupérés", providers });

    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur", error });
    }
});

// ✅ Route pour récupérer un prestataire par ID
router.get("/:id", async (req, res) => {
    try {
        console.log("📌 ID reçu:", req.params.id);

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "❌ ID du prestataire invalide" });
        }

        const provider = await Provider.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: "❌ Prestataire non trouvé" });
        }

        res.json({ message: "✅ Prestataire trouvé", provider });

    } catch (error) {
        console.error("🔥 Erreur serveur:", error);
        res.status(500).json({ message: "❌ Erreur serveur", error });
    }
});

// ✅ Route pour suivre un prestataire par son ID
router.get("/tracking", async (req, res) => {
    try {
        const { providerId } = req.query;
        console.log("📌 providerId reçu:", providerId); // DEBUG

        if (!providerId) {
            return res.status(400).json({ message: "❌ Aucun ID de prestataire fourni" });
        }

        if (!mongoose.Types.ObjectId.isValid(providerId)) {
            return res.status(400).json({ message: "❌ ID du prestataire invalide" });
        }

        const provider = await Provider.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: "❌ Prestataire non trouvé" });
        }

        res.json({ location: provider.location });

    } catch (error) {
        console.error("🔥 Erreur serveur:", error);
        res.status(500).json({ message: "❌ Erreur serveur", error });
    }
});

// 📢 Vérification si la route est bien atteinte
console.log("🚀 Le fichier providerRoutes.js est chargé");

// ✅ Route pour trouver le prestataire le plus proche
router.get("/optimal", async (req, res) => {
    try {
        console.log("📢 La route /optimal a bien été appelée !");

        // 🔍 Récupérer la localisation du client
        const { clientLocation } = req.query;
        console.log("📍 Paramètre reçu : clientLocation =", clientLocation);
        
        if (!clientLocation) {
            return res.status(400).json({ message: "❌ Aucune localisation client fournie" });
        }
        
        const [clientLat, clientLng] = clientLocation.split(",").map(Number);
        if (isNaN(clientLat) || isNaN(clientLng)) {
            return res.status(400).json({ message: "❌ Format de localisation invalide" });
        }
        
        // 🔍 Récupérer les prestataires disponibles
        const providers = await Provider.find({ available: true });
        console.log("📋 Prestataires disponibles :", providers);

        if (providers.length === 0) {
            return res.status(404).json({ message: "❌ Aucun prestataire disponible" });
        }
        
        // 🔍 Vérifier que les IDs sont bien convertis en ObjectId
        const providerIds = providers.map(p => p._id);
        console.log("🔎 IDs des prestataires trouvés :", providerIds);
        
        // 🔍 Obtenir les distances via Google Maps API
        const providerLocations = providers.map(p => `${p.location.lat},${p.location.lng}`);
        console.log("📍 Coordonnées prestataires :", providerLocations);
        
        const distances = await getDistanceMatrix(clientLocation, providerLocations);
        console.log("📡 Réponse distances Google Maps :", distances);

        if (distances.status !== "OK") {
            return res.status(500).json({ message: "❌ Erreur API Google Maps", error: distances });
        }
        
        // 🔍 Trouver le prestataire le plus proche
        let optimalProvider = null;
        let minDistance = Infinity;
        
        providers.forEach((provider, index) => {
            const distanceValue = distances.rows[0].elements[index].distance.value;
            if (distanceValue < minDistance) {
                minDistance = distanceValue;
                optimalProvider = provider;
            }
        });
        
        if (!optimalProvider) {
            return res.status(404).json({ message: "❌ Aucun prestataire trouvé à proximité" });
        }

        // 🔍 Debugging de l'ID du prestataire
        console.log("✅ Prestataire sélectionné :", optimalProvider);
        console.log("🛠 Type de ID :", typeof optimalProvider?._id);
        console.log("🔎 L’ID est-il valide ?", mongoose.Types.ObjectId.isValid(optimalProvider?._id));

        // 🔍 Vérification finale de l'ID du prestataire
        if (!optimalProvider || !optimalProvider._id || !mongoose.Types.ObjectId.isValid(optimalProvider._id)) {
            return res.status(400).json({ message: "❌ ID du prestataire invalide" });
        }

        res.json({ message: "✅ Prestataire optimal trouvé", provider: optimalProvider });
    } catch (error) {
        console.error("🔥 Erreur serveur :", error);
        res.status(500).json({ message: "❌ Erreur serveur", error });
    }
});

// ➡️ Ajouter un prestataire manuellement
router.post('/add-provider', async (req, res) => {
    try {
        const { name, service, email } = req.body;
        const newProvider = new Provider({ name, service, email });
        await newProvider.save();
        res.status(201).json({ message: "✅ Prestataire ajouté avec succès", provider: newProvider });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur lors de l'ajout", error });
    }
});

// ➡️ Obtenir la liste complète des prestataires (admin ou debug)
router.get('/all-providers', async (req, res) => {
    try {
        const providers = await Provider.find();
        res.json({ message: "📜 Liste des prestataires", providers });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur de récupération", error });
    }
});

// ✅ Vérifier si un prestataire est Premium
router.get('/check-provider-premium/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const subscription = await PremiumSubscription.findOne({ provider: providerId, isActive: true });
    res.json({ isPremium: !!subscription });
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur lors de la vérification Premium", error });
  }
});

// ✅ Route pour récupérer la position actuelle d’un prestataire
router.get('/:id/location', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider || !provider.location) {
      return res.status(404).json({ message: '📍 Localisation non trouvée pour ce prestataire' });
    }

    const [lng, lat] = provider.location.coordinates;

    res.status(200).json({
      location: {
        lat,
        lng
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la localisation :', error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Route : Nombre de prestations terminées cette semaine
router.get('/weekly-count/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // dimanche

    const count = await Reservation.countDocuments({
      provider: providerId,
      status: "confirmed",
      date: { $gte: startOfWeek },
    });

    res.json({ count });
  } catch (error) {
    console.error("❌ Erreur weekly-count :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Voir les prestataires favoris
router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ récupéré depuis le token

    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur manquant" });
    }

    const user = await User.findById(userId).populate("favoris");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json(user.favoris);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des favoris :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Ajouter un prestataire aux favoris
router.post('/favorites/:providerId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const providerId = req.params.providerId;

    if (!user.favoris.includes(providerId)) {
      user.favoris.push(providerId);
      await user.save();
    }

    res.status(200).json({ _id: providerId });
  } catch (error) {
    console.error("❌ Erreur POST favoris :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Retirer un prestataire des favoris
router.delete('/favorites/:providerId', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const providerId = req.params.providerId;

    user.favoris = user.favoris.filter(id => id.toString() !== providerId);
    await user.save();

    res.status(200).json({ _id: providerId });
  } catch (error) {
    console.error("❌ Erreur DELETE favoris :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Exporter les routes
module.exports = router;

