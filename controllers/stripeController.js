const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Reservation = require('../models/Reservation');

// ✅ Créer une session de paiement Stripe
exports.createCheckoutSession = async (req, res) => {
  const { reservationId } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: "Réservation introuvable" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'cad',
          product_data: {
            name: `Prestation de ménage – ${reservation.service}`,
          },
          unit_amount: Math.round(reservation.prixTotal * 100), // 💵 en centimes
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/dashboard-client`,
      metadata: {
        reservationId: reservation._id.toString(),
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("❌ Erreur Stripe :", err);
    res.status(500).json({ error: "Erreur lors de la création de la session Stripe" });
  }
};

// ✅ Contrôleur Webhook : traitement de checkout.session.completed
exports.handleStripeWebhook = async (req, res) => {
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

      reservation.paid = true;
      await reservation.save();

      console.log("✅ Réservation marquée comme payée :", reservationId);
    } catch (error) {
      console.error("❌ Erreur de mise à jour de la réservation :", error);
      return res.status(500).json({ message: "Erreur serveur" });
    }
  }

  res.status(200).json({ received: true });
};

