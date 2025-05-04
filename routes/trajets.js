const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL de l'API de Machine Learning
const ML_API_URL = 'http://localhost:5001/predict-trajet'; // Change selon ton API ML

// Route pour récupérer un trajet optimisé
router.post('/optimiser-trajet', async (req, res) => {
    try {
        // Récupération des données envoyées par le client
        const { adresse_depart, adresse_arrivee } = req.body;

        // Envoi des données à l'API ML
        const response = await axios.post(ML_API_URL, { adresse_depart, adresse_arrivee });

        // Renvoyer la réponse au client
        res.json({
            success: true,
            trajet_optimise: response.data.trajet,
            temps_estime: response.data.temps_estime
        });

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API ML :", error.message);
        res.status(500).json({ success: false, message: "Erreur lors du calcul du trajet optimisé" });
    }
});

module.exports = router;

