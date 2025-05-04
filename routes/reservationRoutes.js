const express = require("express");
const router = express.Router();

const path = require("path");
const Reservation = require(path.join(__dirname, "../models/Reservation.js"));
const Provider = require(path.join(__dirname, "../models/Provider.js"));
const PremiumSubscription = require(path.join(__dirname, "../models/PremiumSubscription.js"));

const isAdmin = require("../middlewares/isAdmin.js");
const verifyToken = require("../middlewares/authMiddleware.js"); // ✅ CORRECTION : import unique

const reservationController = require("../controllers/reservationController");
const cron = require("node-cron");

const {
  sendClientNotification,
  sendProviderNotification,
  sendReservationCancellation,
  sendReservationReminder,
} = require("../services/emailService.js");

const multer = require("multer");
const fs = require("fs");

// ✅ Configuration de Multer pour enregistrer les photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `uploads/reservations`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// ✅ Route de création de réservation officielle
router.post(
  "/",
  verifyToken,
  upload.array("photos", 50),
  reservationController.createReservation
);

// ✅ Voir toutes les réservations (admin seulement)
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json({ message: "✅ Réservations récupérées", reservations });
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
});

// ✅ Suivi du statut d'une réservation
router.patch("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["En attente", "Attribuée", "En cours", "Terminée", "Annulée"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "❌ Statut invalide" });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!reservation) return res.status(404).json({ message: "❌ Réservation non trouvée" });

    res.status(200).json({ message: "✅ Statut mis à jour", reservation });
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

// ✅ Acceptation ou refus d'une réservation
router.patch("/:id/accept", verifyToken, reservationController.acceptReservation);
router.patch("/:id/refuse", verifyToken, reservationController.refuseReservation);
router.patch("/:id/estimate", verifyToken, reservationController.estimateReservation);
router.patch("/:id/pay", verifyToken, reservationController.markAsPaid);

// ✅ Estimation finale par le prestataire
router.post("/:id/niveau-sale", verifyToken, reservationController.finalEstimation);

// ✅ Détails d'une réservation spécifique
router.get("/:id", verifyToken, reservationController.getReservationById);

// ✅ Toutes les réservations d’un client
router.get("/user/:userId", verifyToken, reservationController.getReservationsByUser);

// ✅ Modifier une réservation
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "❌ Réservation non trouvée" });

    if (req.user.id !== reservation.user.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "⛔ Accès interdit" });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "✅ Réservation mise à jour", reservation: updatedReservation });
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
});

// ✅ Supprimer une réservation
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "❌ Réservation non trouvée" });

    if (req.user.id !== reservation.user.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "🚫 Accès interdit" });
    }

    try {
      await sendReservationCancellation(req.user.email, reservation);
      console.log("📩 Email d’annulation envoyé !");
    } catch (emailError) {
      console.error("❌ Erreur email :", emailError);
    }

    await reservation.deleteOne();
    res.json({ message: "✅ Réservation supprimée et email envoyé" });
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
});

// ✅ Historique des prestations d’un prestataire
router.get("/history/:providerId", reservationController.getProviderHistory);

// ✅ Objectifs hebdo du prestataire
router.get("/weekly-goals/:providerId", async (req, res) => {
  try {
    const { providerId } = req.params;
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now.setDate(now.getDate() - diffToMonday));
    monday.setHours(0, 0, 0, 0);

    const reservations = await Reservation.find({
      provider: providerId,
      status: "confirmed",
      date: { $gte: monday },
    });

    const count = reservations.length;

    let badge = "";
    if (count >= 5) badge = "🏆 Champion de la semaine";
    else if (count >= 3) badge = "⭐ Performer";
    else if (count >= 1) badge = "🚀 Bien démarré";

    res.json({ count, badge });
  } catch (error) {
    console.error("❌ Erreur objectifs hebdo :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Envoi automatique de rappels
cron.schedule("0 0 * * *", async () => {
  try {
    const maintenant = new Date();
    const demain = new Date(maintenant);
    demain.setDate(maintenant.getDate() + 1);

    const reservations = await Reservation.find({
      date: {
        $gte: new Date(demain.setHours(0, 0, 0, 0)),
        $lt: new Date(demain.setHours(23, 59, 59, 999)),
      },
    });

    for (const reservation of reservations) {
      await sendReservationReminder(reservation.user.email, reservation);
      console.log(`📩 Rappel envoyé pour réservation du ${reservation.date}`);
    }
  } catch (error) {
    console.error("❌ Erreur rappels :", error);
  }
});

module.exports = router;

