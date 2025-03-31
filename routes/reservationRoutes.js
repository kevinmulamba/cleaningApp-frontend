const express = require('express');
const path = require('path');
const Reservation = require(path.join(__dirname, '../models/Reservation.js'));
const Provider = require("../models/Provider.js");
const PremiumSubscription = require("../models/PremiumSubscription.js");
const authMiddleware = require('../middlewares/authMiddleware.js');
const isAdmin = require('../middlewares/isAdmin.js');
const cron = require("node-cron");
const { 
    sendClientNotification, 
    sendProviderNotification, 
    sendReservationConfirmation, 
    sendReservationCancellation, 
    sendReservationReminder 
} = require("../services/emailService.js"); 

const router = express.Router();

// ✅ Route pour créer une réservation avec réduction premium si applicable
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { date, service, location, categorie, basePrice } = req.body;

        const provider = await Provider.findOne({ service, location });

        if (!provider) {
            return res.status(404).json({ message: "❌ Aucun prestataire disponible pour cette date et ce service" });
        }

        // ✅ Vérifie abonnement Premium
        const premiumSub = await PremiumSubscription.findOne({ user: req.user.id, isActive: true });

        let finalPrice = basePrice;
        let discountApplied = false;

        if (premiumSub) {
            const discount = basePrice * 0.1; // 10% pour Premium
            finalPrice = basePrice - discount;
            discountApplied = true;
        }

        const newReservation = new Reservation({
            user: req.user.id,
            provider: provider._id,
            date,
            service,
            location,
            categorie,
            price: finalPrice,
            discountApplied,
            status: "en attente",
        });

        const savedReservation = await newReservation.save();

        await sendClientNotification(req.user.email, { date, service, location, providerName: provider.name });
        await sendProviderNotification(provider.email, { date, service, location });

        res.status(201).json({ 
            message: "✅ Réservation créée avec avantages fidélité si applicable",
            reservation: savedReservation 
        });

    } catch (error) {
        console.error("❌ Erreur lors de la création de la réservation :", error);
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
});

// ✅ Route accessible uniquement aux admins pour voir toutes les réservations
router.get('/', authMiddleware, isAdmin, async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json({ message: "✅ Réservations récupérées", reservations });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
});

// ✅ Route pour voir uniquement les réservations d’un utilisateur spécifique
router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: "⛔ Accès interdit" });
        }

        const reservations = await Reservation.find({ user: req.params.userId });
        res.json({ message: "✅ Réservations récupérées", reservations });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
});

// ✅ Route pour créer une réservation avec assignation automatique et notifications
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { date, service, location } = req.body;

        const provider = await Provider.findOne({ service, location });

        if (!provider) {
            return res.status(404).json({ message: "❌ Aucun prestataire disponible pour cette date et ce service" });
        }

        const newReservation = new Reservation({
            user: req.user.id,
            provider: provider._id,
            date,
            service,
            location,
            status: "en attente",
        });

        const savedReservation = await newReservation.save();

        await sendClientNotification(req.user.email, { date, service, location, providerName: provider.name });
        await sendProviderNotification(provider.email, { date, service, location });

        res.status(201).json({ message: "✅ Réservation créée avec succès et notifications envoyées", reservation: savedReservation });

    } catch (error) {
        console.error("❌ Erreur lors de la création de la réservation :", error);
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
});

// ✅ Suivi en temps réel du prestataire
router.patch("/:id/status", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ["En attente", "Attribuée", "En cours", "Terminée", "Annulée"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "❌ Statut invalide" });
        }

        const reservation = await Reservation.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!reservation) {
            return res.status(404).json({ message: "❌ Réservation non trouvée" });
        }

        res.status(200).json({ message: "✅ Statut mis à jour", reservation });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur", error });
    }
});

// ✅ Route pour modifier une réservation
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "❌ Réservation non trouvée" });
        }

        if (req.user.id !== reservation.user.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "⛔ Accès interdit" });
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "✅ Réservation mise à jour", reservation: updatedReservation });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
});

// ✅ Route pour supprimer une réservation
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "❌ Réservation non trouvée" });
        }

        if (req.user.id !== reservation.user.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "🚫 Accès interdit" });
        }

        try {
            await sendReservationCancellation(req.user.email, reservation);
            console.log("📩 Email d’annulation envoyé !");
        } catch (emailError) {
            console.error("❌ Erreur lors de l'envoi de l'email d'annulation :", emailError);
        }

        await reservation.deleteOne();
        res.json({ message: "✅ Réservation supprimée et email envoyé" });
    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur" });
    }
});

// ✅ Planification d'envoi de rappel
cron.schedule("0 0 * * *", async () => {
    try {
        const maintenant = new Date();
        const demain = new Date(maintenant);
        demain.setDate(maintenant.getDate() + 1);

        const reservations = await Reservation.find({
            date: {
                $gte: new Date(demain.setHours(0, 0, 0, 0)),
                $lt: new Date(demain.setHours(23, 59, 59, 999))
            }
        });

        for (const reservation of reservations) {
            await sendReservationReminder(reservation.user.email, reservation);
            console.log(`📩 Rappel envoyé pour réservation du ${reservation.date}`);
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi des rappels :", error);
    }
});

const task = cron.schedule("0 0 * * *", async () => {
    console.log("📌 Tâche planifiée exécutée...");
}, { scheduled: false });

const stopCron = () => {
    console.log("🛑 Arrêt de la tâche cron...");
    task.stop();
};

module.exports = router;

