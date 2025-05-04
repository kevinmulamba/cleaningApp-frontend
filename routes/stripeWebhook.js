// routes/stripeWebhook.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Reservation = require("../models/Reservation");

module.exports = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Signature Stripe invalide :", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const reservationId = session.metadata.reservationId;

    try {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        console.error("❌ Réservation introuvable :", reservationId);
        return res.status(404).json({ message: "Réservation introuvable" });
      }

      // ✅ Protection contre les valeurs invalides de niveauSalete
      const niveauxAutorises = ['faible', 'modere', 'important', 'critique'];
      if (!niveauxAutorises.includes(reservation.niveauSalete)) {
        console.warn(`⚠️ niveauSalete invalide (${reservation.niveauSalete}), valeur remplacée par 'modere'`);
        reservation.niveauSalete = 'modere';
      }

      reservation.paid = true;
      await reservation.save();

      console.log("✅ Réservation marquée comme payée :", reservationId);
    } catch (error) {
      console.error("❌ Erreur mise à jour paid :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  res.status(200).json({ received: true });
};

