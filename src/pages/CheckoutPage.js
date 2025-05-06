import React from "react";
import CheckoutForm from "../components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// ✅ Charger la clé publique Stripe depuis .env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  // ✅ À remplacer dynamiquement (ex : via useParams() ou contexte)
  const reservationId = "67e6f79b9e555ecbc3a9f6a7"; // exemple temporaire

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 rounded-xl shadow bg-white dark:bg-zinc-900">
      <h2 className="text-xl font-bold mb-4 text-center">Paiement sécurisé</h2>
      <Elements stripe={stripePromise}>
        <CheckoutForm reservationId={reservationId} />
      </Elements>
    </div>
  );
};

export default CheckoutPage;

