const express = require("express");
const axios = require("axios");
const { PythonShell } = require("python-shell");
const path = require("path");
const { spawn } = require('child_process');

const router = express.Router();

// ✅ Log pour voir si le fichier est bien chargé
console.log("✅ Le fichier predictionRoutes.js est bien chargé !");

// 🌍 URL de l'API ML
const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:5001/predict";

// ✅ Fonction pour convertir une adresse en coordonnées GPS
async function getCoordinates(address) {
    try {
        const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        if (!API_KEY) {
            console.error("❌ Clé API Google Maps non définie !");
            return null;
        }

        const formattedAddress = `${address}, France`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json`;

        console.log("📡 Envoi de la requête à Google Maps API pour :", formattedAddress);

        const response = await axios.get(url, {
            params: { address: formattedAddress, key: API_KEY }
        });

        console.log("📡 Réponse complète de Google Maps API :", JSON.stringify(response.data, null, 2));

        if (response.data.status === "OK") {
            const { lat, lng } = response.data.results[0].geometry.location;
            console.log(`✅ Coordonnées trouvées pour ${formattedAddress} : lat=${lat}, lng=${lng}`);
            return { lat, lng };
        } else {
            console.error(`❌ Erreur de géocodage : ${response.data.status} - ${response.data.error_message || "Aucune erreur détaillée"}`);
            return null;
        }
    } catch (error) {
        console.error("❌ Erreur lors de la requête à Google Maps API :", error.message);
        return null;
    }
}

// ✅ Route pour récupérer un trajet optimisé depuis l'API ML
router.post("/optimiser-trajet", async (req, res) => {
    try {
        console.log("🚀 Requête reçue pour /optimiser-trajet :", req.body);

        const { adresse_depart, adresse_arrivee, distance_km } = req.body;

        // 🔴 Vérification des paramètres
        if (!adresse_depart || !adresse_arrivee || !distance_km || isNaN(distance_km)) {
            return res.status(400).json({ success: false, message: "Données invalides ou manquantes" });
        }

        // 🔴 Conversion des adresses en coordonnées GPS
        const startCoords = await getCoordinates(adresse_depart);
        const endCoords = await getCoordinates(adresse_arrivee);

        if (!startCoords || !endCoords) {
            return res.status(400).json({ success: false, message: "❌ Impossible de géocoder les adresses" });
        }

        // 🔴 Construction des données pour l'API ML
        const requestData = {
            start_lat: startCoords.lat,
            start_lng: startCoords.lng,
            end_lat: endCoords.lat,
            end_lng: endCoords.lng,
            distance_km,
        };

        // ✅ Log pour voir les données envoyées à l’API ML
        console.log("📦 Données envoyées à l'API ML :", requestData);

        // ✅ Log avant l’appel à l’API ML
        console.log("🔄 Tentative d'appel à l'API ML avec les données :", requestData);

        // 🔴 Appel à l'API ML
        const response = await axios.post(ML_API_URL, requestData);
        console.log("✅ Réponse reçue de l'API ML :", response.data);

        // 🔴 Envoi de la réponse au client
        return res.json({ success: true, predicted_duration_min: response.data.predicted_duration_min });

    } catch (error) {
        // ✅ Log pour afficher les erreurs détaillées
        console.error("❌ Erreur complète reçue :", error.response ? error.response.data : error.message);

        return res.status(500).json({
            success: false,
            message: "Erreur lors du calcul du trajet optimisé",
            details: error.response ? error.response.data : error.message,
        });
    }
});

// ✅ Route pour sauvegarder une prédiction
router.post("/save_prediction", async (req, res) => {
    try {
        const { start_lat, start_lng, end_lat, end_lng, distance_km, predicted_duration_min } = req.body;

        if (!start_lat || !start_lng || !end_lat || !end_lng || !distance_km || !predicted_duration_min) {
            return res.status(400).json({ message: "Données manquantes !" });
        }

        console.log("📡 Nouvelle prédiction reçue :", req.body);

        return res.status(201).json({ message: "✅ Prédiction enregistrée avec succès !" });

    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement :", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
});

// ✅ Route de test pour vérifier si /predict est bien appelée
router.post("/predict", async (req, res) => {
    try {
        console.log("🚀 Requête reçue pour /predict :", req.body);

        // 🔴 Vérification des données envoyées
        const { start_lat, start_lng, end_lat, end_lng, distance_km } = req.body;
        if (!start_lat || !start_lng || !end_lat || !end_lng || !distance_km) {
            return res.status(400).json({ success: false, message: "Données invalides ou manquantes" });
        }

        // ✅ Log avant l’appel à l’API ML
        console.log("🔄 Tentative d'appel à l'API ML avec les données :", req.body);

        // 🔴 Appel à l'API ML
        const response = await axios.post(ML_API_URL, req.body);
        console.log("✅ Réponse de l'API ML :", response.data);

        return res.json({ success: true, predicted_duration_min: response.data.predicted_duration_min });

    } catch (error) {
        console.error("❌ Erreur complète reçue :", error.response ? error.response.data : error.message);
        return res.status(500).json({
            success: false,
            message: "Erreur lors du calcul du trajet optimisé",
            details: error.message,
        });
    }
});

// ✅ Route prédictive basée sur modèle local (model.pkl)
router.post('/predict-duree', async (req, res) => {
  try {
    const inputData = req.body;
    console.log("📡 Données reçues pour /predict-duree :", inputData);

    const pythonProcess = spawn('python3', ['ml/predict.py', JSON.stringify(inputData)]);

    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      console.log("📨 Données Python stdout :", data.toString());
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error("🐍 Erreur Python stderr :", data.toString());
      pythonError += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`❌ Le script Python a échoué avec le code ${code}`);
        return res.status(500).json({ message: "Erreur du script Python", details: pythonError });
      }

      if (pythonError.includes("Traceback")) {
        console.error("🐍 Erreur Python réelle détectée :", pythonError);
        return res.status(500).json({ message: "Erreur réelle dans le script Python", details: pythonError });
      }

      try {
        const output = JSON.parse(pythonOutput);
        console.log("✅ Résultat JSON analysé :", output);
        return res.json(output);
      } catch (err) {
        console.error("❌ Erreur de parsing JSON :", err.message);
        return res.status(500).json({ message: "Erreur de parsing JSON", error: err.message });
      }
    });

  } catch (err) {
    console.error("❌ Erreur globale :", err.message);
    return res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;

