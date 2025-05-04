const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const isAdmin = require("../middlewares/isAdmin");
const verifyToken = require("../middlewares/authMiddleware"); 

// ✅ GET - Récupérer la grille tarifaire dynamique sans cache
router.get("/pricing", (req, res) => {
  // Recharge à chaud les tarifs
  delete require.cache[require.resolve("../config/pricingTable")];
  const { pricingTable, MAJORATIONS } = require("../config/pricingTable");

  res.json({
    message: "✅ Grille tarifaire dynamique rechargée",
    pricingTable,
    majorations: MAJORATIONS,
  });
});

// ✅ PUT - Mettre à jour la grille tarifaire (admin uniquement)
router.put("/pricing", verifyToken, isAdmin, async (req, res) => {
  const { pricingTable: newPricing, majorations: newMaj } = req.body;

  if (!newPricing || !newMaj) {
    return res.status(400).json({ message: "❌ Données incomplètes" });
  }

  // 🧠 Générer le contenu JS à écrire dans le fichier
  const newFileContent = `module.exports = {
  pricingTable: ${JSON.stringify(newPricing, null, 2)},
  MAJORATIONS: ${JSON.stringify(newMaj, null, 2)},
};`;

  try {
    // 📝 Écrire dans le fichier de config
    fs.writeFileSync(
      path.join(__dirname, "../config/pricingTable.js"),
      newFileContent,
      "utf-8"
    );

    res.json({ message: "✅ Grille tarifaire mise à jour avec succès" });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
});

module.exports = router;

