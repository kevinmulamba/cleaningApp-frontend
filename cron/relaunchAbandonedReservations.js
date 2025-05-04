// ✅ Connexion MongoDB si exécuté seul
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connecté !");
}).catch((err) => {
  console.error("❌ Erreur de connexion MongoDB :", err);
});

const Reservation = require("../models/Reservation");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { sendPushNotification } = require("../services/notificationService");

const relaunchAbandonedReservations = async () => {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const abandonedReservations = await Reservation.find({
    status: 'draft',
    createdAt: { $lte: fifteenMinutesAgo },
  }).populate("user");

  if (abandonedReservations.length === 0) {
    console.log("✅ Aucune réservation en brouillon à relancer.");
    return;
  }

  for (const reservation of abandonedReservations) {
    const user = reservation.user;
    if (!user || !user.email) continue;

    const subject = "🧼 Finalisez votre réservation sur CleaningApp";

    const html = `
      <h2>Bonjour ${user.name || "cher utilisateur"},</h2>
      <p>Il semble que vous n’ayez pas terminé votre réservation de ménage.</p>
      
      <p><strong>Catégorie :</strong> ${reservation.category || 'Non précisé'}</p>
      <p><strong>Service :</strong> ${reservation.service || 'Non précisé'}</p>
      <p><strong>Lieu :</strong> ${reservation.adresse || reservation.location || 'Non précisé'}</p>
      <p><strong>Date prévue :</strong> ${reservation.date ? new Date(reservation.date).toLocaleDateString() : 'Non précisé'}</p>
      <p><strong>Heure :</strong> ${reservation.heure || 'Non précisé'}</p>
      
      <br/>
      <a href="https://yourdomain.com/resume-reservation/${reservation._id}"
         style="padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px;">
        🌟 Reprendre ma réservation
      </a>
      <br><br>
      <p>À bientôt 👋<br>L’équipe CleaningApp</p>
    `;

    await sendEmail(user.email, subject, html);
    console.log(`📧 Relance envoyée à ${user.email}`);
  }
};

module.exports = relaunchAbandonedReservations;

// ✅ Test manuel si exécuté directement
if (require.main === module) {
  relaunchAbandonedReservations().then(() => {
    console.log("✅ Relances terminées !");
    process.exit();
  });
}

