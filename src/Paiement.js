import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './components/CheckoutForm';
import ButtonPrimary from './components/ButtonPrimary'; // ✅ Import du bouton

// Remplace par ta vraie clé publique Stripe (pk_test_...)
const stripePromise = loadStripe('pk_test_51NUJfbB6dVCk5k4lTCA2pA1SNv8e3pDLqUbhMYc3IiSSkkuLpoDVS...');

const Paiement = () => {
  return (
    <div className="p-6 shadow-xl bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Paiement sécurisé</h2>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>

      {/* ✅ Nouveau bouton */}
      <div className="mt-6 text-center">
        <ButtonPrimary onClick={() => alert("Paiement déclenché !")}>
          Payer maintenant
        </ButtonPrimary>
      </div>
    </div>
  );
};

export default Paiement;

