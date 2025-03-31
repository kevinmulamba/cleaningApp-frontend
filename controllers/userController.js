const User = require('../models/User'); // ✅ Assurez-vous d'importer le modèle User

// ✅ Récupérer tous les utilisateurs
exports.getUsers = (req, res) => {
    res.json({ message: "Liste des utilisateurs" });
};

// ✅ Récupérer un utilisateur par son ID
exports.getUserById = (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Utilisateur avec l'ID: ${userId}` });
};

// ✅ Ajouter un prestataire favori (avec logs de débogage)
exports.addFavoriteProvider = async (req, res) => {
    try {
        console.log("➡️ userId reçu :", req.params.id);
        console.log("➡️ providerId reçu :", req.body.providerId);

        const userId = req.params.id;
        const { providerId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            console.log("❌ Aucun utilisateur trouvé avec cet ID :", userId);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (user.favoris.includes(providerId)) {
            return res.status(400).json({ message: "Le prestataire est déjà dans les favoris" });
        }

        user.favoris.push(providerId);
        await user.save();

        console.log("✅ Favori ajouté avec succès :", user.favoris);
        res.status(200).json({ message: "Prestataire ajouté aux favoris avec succès", favoris: user.favoris });
    } catch (error) {
        console.error("🔥 Erreur lors de l’ajout aux favoris :", error);
        res.status(500).json({ message: "Erreur lors de l’ajout aux favoris" });
    }
};

