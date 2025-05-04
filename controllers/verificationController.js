const path = require("path");
const fs = require("fs");
const compareFaces = require("../utils/compareFaces"); // ✅ importer ici

// 📸 Contrôleur pour upload + vérification du selfie
exports.uploadSelfie = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucune image reçue" });
    }

    const selfiePath = req.file.path;
    console.log("✅ Selfie reçu :", selfiePath);

    // 📌 Démo : image de référence fixe (à personnaliser selon le prestataire)
    const referenceImagePath = "uploads/references/reference.jpg";

    // 🧠 Appel de la comparaison faciale
    const isMatch = await compareFaces(referenceImagePath, selfiePath);

    if (isMatch) {
      return res.status(200).json({ success: true, message: "Visage reconnu ✅" });
    } else {
      return res.status(401).json({ success: false, message: "Visage non reconnu ❌" });
    }
  } catch (error) {
    console.error("❌ Erreur lors du traitement du selfie :", error);
    res.status(500).json({ message: "Erreur serveur lors de la vérification du selfie" });
  }
};

