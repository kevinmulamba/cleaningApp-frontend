const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Reservation = require("../models/Reservation");

// ✅ Créer une session de paiement Stripe Checkout
router.post("/create-checkout-session", async (req, res) => {
  const { reservationId } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `Paiement - ${reservation.service}`,
            },
            unit_amount: Math.round(reservation.prixTotal * 100), // 💵 en centimes
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        reservationId: reservation._id.toString(),
      },
      success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Erreur Stripe :", err);
    res.status(500).json({ message: "Erreur création session Stripe" });
  }
});

module.exports = router; // ✅ correction ici

