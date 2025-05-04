const Reservation = require("../models/Reservation");
const Provider = require("../models/Provider");
const User = require("../models/User");
const calculatePrice = require("../utils/calculatePrice");
const sendEmail = require("../utils/sendEmail");
const { sendPushNotification } = require("../services/notificationService");
const { updateUserPreferences, addFavoriteProvider } = require("../services/userService");

// ✅ Générer un code PIN à 4 chiffres
const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();

// ✅ Créer une nouvelle réservation
const createReservation = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1 || req.files.length > 30) {
      return res.status(400).json({ message: "Ajoutez entre 1 et 30 photos." });
    }

    const clientId = req.user.id;
    const {
      typeService,
      surface,
      adresse,
      date,
      heure,
      niveauSalete,
      options,
    } = req.body;

    if (!typeService || !surface || !adresse || !date || !heure) {
      return res.status(400).json({ message: "Champs manquants dans la requête." });
    }

    const photoPaths = req.files?.map((file) => file.path) || [];

    const prix = calculatePrice({
      surface,
      typeService,
      niveauSale: niveauSalete,
      options
    }) || {
      total: 0,
      provider: 0,
      platform: 0,
    };

    const reservation = new Reservation({
      client: clientId,
      service: typeService,
      surface,
      adresse,
      date,
      heure,
      photos: photoPaths,
      options,
      niveauSalete,
      validationPin: generatePin(),
      status: "en_attente_prestataire",
      categorie: "Nettoyage maison",
      prixTotal: prix.total,
      partPrestataire: prix.provider,
      partPlateforme: prix.platform,
      paid: false,
    });

    await reservation.save();
   
    if (req.body.preferences) {
      const updatedUser = await updateUserPreferences(req.user.id, req.body.preferences);
      console.log("✅ Préférences mises à jour :", updatedUser.preferences);
    }

    const io = req.app.get("io");
    io.emit("nouvelle_reservation", {
      id: reservation._id,
      adresse: reservation.adresse,
      date: reservation.date,
      heure: reservation.heure,
      service: reservation.service,
    });

    res.status(201).json({ message: "✅ Réservation créée avec succès", reservation });
  } catch (error) {
    console.error("❌ Erreur création réservation :", error);
    res.status(500).json({ message: "Erreur serveur lors de la création." });
  }
};

const verifyReservationPin = async (req, res) => {
  const { reservationId, enteredPin } = req.body;
  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "❌ Réservation introuvable" });

    if (reservation.validationPin === enteredPin) {
      return res.status(200).json({ success: true, message: "✅ Code PIN validé avec succès" });
    } else {
      return res.status(401).json({ success: false, message: "❌ Code PIN incorrect" });
    }
  } catch (err) {
    console.error("❌ Erreur vérification PIN :", err);
    res.status(500).json({ message: "Erreur serveur lors de la vérification" });
  }
};

const getReservationsByUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ client: req.params.userId })
      .sort({ date: -1 });
    console.log("📦 Réservations récupérées :", reservations);
    res.status(200).json({ reservation: reservations });
  } catch (error) {
    console.error("❌ Erreur récupération réservations :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const getProviderHistory = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      provider: req.params.providerId,
      status: "Terminée",
    });
    res.status(200).json({ reservations });
  } catch (error) {
    console.error("❌ Erreur getProviderHistory :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const acceptReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "❌ Réservation introuvable" });
    if (reservation.provider && reservation.status !== "en_attente_prestataire") {
      return res.status(403).json({ message: "⛔ Réservation déjà prise par un autre prestataire." });
    }
    reservation.status = "en_attente_estimation";
    reservation.provider = req.user.id;
    await reservation.save();
    res.status(200).json({ message: "✅ Mission acceptée, en attente d’estimation", reservation });
  } catch (error) {
    console.error("❌ Erreur lors de l’acceptation :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const refuseReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "refused" },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: "Réservation introuvable" });
    res.status(200).json({ message: "❌ Réservation refusée avec succès", reservation });
  } catch (error) {
    console.error("❌ Erreur lors du refus :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const rescheduleReservation = async (req, res) => {
  const { id: reservationId } = req.params;
  try {
    const oldReservation = await Reservation.findById(reservationId);
    if (!oldReservation) return res.status(404).json({ message: "Réservation introuvable" });
    oldReservation.reprogrammed = true;
    oldReservation.status = "annulée";
    await oldReservation.save();

    const otherProvider = await Provider.findOne({ _id: { $ne: oldReservation.provider } });
    if (!otherProvider) return res.status(404).json({ message: "Aucun autre prestataire dispo" });

    const newDate = new Date(oldReservation.date);
    newDate.setDate(newDate.getDate() + 1);

    const newReservation = new Reservation({
      user: oldReservation.user,
      provider: otherProvider._id,
      date: newDate,
      service: oldReservation.service,
      location: oldReservation.location,
      validationPin: generatePin(),
      status: "en attente",
      categorie: oldReservation.categorie,
      surface: oldReservation.surface,
      niveauSalete: oldReservation.niveauSalete,
      options: oldReservation.options,
      prixTotal: oldReservation.prixTotal,
      partPrestataire: oldReservation.partPrestataire,
      partPlateforme: oldReservation.partPlateforme,
      discountApplied: oldReservation.discountApplied,
      photos: oldReservation.photos,
      paid: false,
      reprogrammed: false,
    });

    await newReservation.save();

    const user = await User.findById(oldReservation.user);
    if (user?.email) {
      await sendEmail(
        user.email,
        "Nouvelle date pour votre prestation",
        `<p>Bonjour ${user.name},</p><p>Votre prestation a été reprogrammée au <strong>${newDate.toLocaleDateString()}</strong>.</p><p><a href="http://localhost:3000/dashboard-client">👉 Cliquez ici pour valider</a></p>`
      );
    }

    res.status(200).json({ message: "✅ Nouvelle réservation créée", newReservation });
  } catch (error) {
    console.error("❌ Erreur reprogrammation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const estimateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { niveauSale } = req.body;
    if (!niveauSale) return res.status(400).json({ message: "⛔ Niveau de saleté requis" });
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: "❌ Réservation introuvable" });
    reservation.niveauSalete = niveauSale;
    await reservation.save();
    res.status(200).json({ message: "✅ Niveau de saleté mis à jour", reservation });
  } catch (error) {
    console.error("❌ Erreur estimation :", error);
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "❌ Réservation non trouvée" });
    res.status(200).json({ reservation });
  } catch (error) {
    console.error("❌ Erreur récupération réservation :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const finalEstimation = async (req, res) => {
  try {
    const { id } = req.params;
    const { niveauSale } = req.body;
    if (!niveauSale) return res.status(400).json({ message: "⛔ Niveau de saleté requis" });
    const reservation = await Reservation.findById(id);
    if (!reservation) return res.status(404).json({ message: "❌ Réservation introuvable" });

    reservation.niveauSalete = niveauSale;
    const prix = calculatePrice({
      surface: reservation.surface,
      typeService: reservation.service,
      niveauSale: niveauSale,
      options: reservation.options,
    });
    reservation.prixTotal = prix.total;
    reservation.partPrestataire = prix.provider;
    reservation.partPlateforme = prix.platform;
    reservation.status = "estime";
    await reservation.save();

    res.status(200).json({
      message: "✅ Estimation finale enregistrée",
      reservation,
      tarif: prix,
    });
  } catch (error) {
    console.error("❌ Erreur estimation finale :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { paid: true },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: "❌ Réservation non trouvée" });
    res.status(200).json({ message: "✅ Réservation marquée comme payée", reservation });
  } catch (error) {
    console.error("❌ Erreur paiement :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createReservation,
  verifyReservationPin,
  getReservationsByUser,
  getProviderHistory,
  acceptReservation,
  refuseReservation,
  rescheduleReservation,
  estimateReservation,
  getReservationById,
  finalEstimation,
  markAsPaid,
};
